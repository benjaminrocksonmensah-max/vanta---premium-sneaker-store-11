import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import axios from 'axios';
import fs from 'fs';

// Initialize Firebase Admin
if (getApps().length === 0) {
  let projectId = 'vaulted-abode-26shk';
  try {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
    projectId = config.projectId;
  } catch (e) {
    console.warn('Could not read firebase-applet-config.json, using default projectId');
  }
  initializeApp({ projectId });
}

// Support multiple databases
let dbId = 'ai-studio-vantapremiumsnea-d71e972c-6103-420e-93cd-2be57b3be073';
try {
  const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
  if (config.firestoreDatabaseId) dbId = config.firestoreDatabaseId;
} catch (e) {}

const db = getFirestore(dbId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- PAYMENT ENDPOINTS ---

  app.post('/api/payments/mobile-money/initialize', async (req, res) => {
    try {
      const { orderId, email, phone, provider } = req.body;

      if (!orderId || !email || !phone || !provider) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify Paystack Secret Key is configured
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      
      // 1. Fetch order from Firestore to verify amount
      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const orderData = orderDoc.data();
      if (!orderData) {
        return res.status(404).json({ error: 'Order data is empty' });
      }

      if (orderData.paymentStatus === 'paid') {
        return res.status(400).json({ error: 'Order is already paid' });
      }

      // 2. Calculate correct amount from authoritative order
      const amountGHS = orderData.totalAmount || orderData.total;
      const amountPesewas = Math.round(amountGHS * 100);

      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      if (!paystackSecretKey) {
        console.error('PAYSTACK_SECRET_KEY is missing. Payment initialization aborted.');
        return res.status(500).json({ 
          success: false, 
          code: 'PAYSTACK_NOT_CONFIGURED', 
          error: 'Paystack payment service is not configured.' 
        });
      }

      // Map provider string to Paystack expected values
      // Paystack accepts: mtn, vod, tgo
      let paystackProvider = provider.toLowerCase();
      if (paystackProvider === 'airteltigo') paystackProvider = 'tgo';
      if (paystackProvider === 'telecel' || paystackProvider === 'vodafone') paystackProvider = 'vod';

      // 3. Create Paystack Charge
      const paystackPayload = {
        amount: amountPesewas,
        email: email,
        currency: 'GHS',
        mobile_money: {
          phone: phone,
          provider: paystackProvider
        },
        metadata: {
          orderId: orderId
        }
      };

      const response = await axios.post('https://api.paystack.co/charge', paystackPayload, {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const paystackData = response.data;
      
      if (!paystackData.status) {
        return res.status(400).json({ error: paystackData.message || 'Payment initiation failed' });
      }

      const reference = paystackData.data.reference;

      // 4. Create Payment Record in Firestore
      const paymentRef = db.collection('payments').doc(reference);
      await paymentRef.set({
        orderId,
        userId: orderData.userId || null,
        provider: 'paystack',
        method: 'mobile_money',
        mobileMoneyProvider: provider,
        phoneMasked: phone.substring(0, 3) + '****' + phone.substring(phone.length - 3),
        amount: amountGHS,
        currency: 'GHS',
        status: paystackData.data.status === 'send_otp' ? 'pending' : paystackData.data.status,
        providerReference: reference,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Also update order with the payment reference to track it
      await orderRef.update({
        paymentReference: reference,
        paymentStatus: 'pending'
      });

      res.json({
        success: true,
        reference: reference,
        message: paystackData.message,
        status: paystackData.data.status,
        display_text: paystackData.data.display_text || 'Please check your phone to approve the payment.'
      });

    } catch (error: any) {
      console.error('Payment initialization error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: error.response?.data?.message || 'Internal server error during payment initialization' 
      });
    }
  });

  // Webhook Endpoint
  app.post('/api/payments/paystack/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    // Note: For full security, verify the x-paystack-signature header using crypto.createHmac
    // and process.env.PAYSTACK_SECRET_KEY
    const crypto = await import('crypto');
    const secret = process.env.PAYSTACK_SECRET_KEY;
    
    if (secret) {
      const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
      if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Invalid signature');
      }
    }

    const event = req.body;
    
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      try {
        if (!secret) {
          throw new Error('PAYSTACK_SECRET_KEY is missing, cannot verify webhook');
        }

        // 1. Explicitly verify the transaction status with Paystack
        const verifyResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${secret}`
          }
        });

        const verifyData = verifyResponse.data;
        if (!verifyData.status || verifyData.data.status !== 'success') {
          console.error(`Transaction ${reference} is not marked as success in Paystack.`);
          return res.status(400).send('Verification failed');
        }

        const paystackAmount = verifyData.data.amount;
        const paystackCurrency = verifyData.data.currency;

        await db.runTransaction(async (transaction) => {
          const paymentRef = db.collection('payments').doc(reference);
          const paymentDoc = await transaction.get(paymentRef);
          
          if (!paymentDoc.exists) {
            console.error(`Webhook error: Payment ${reference} not found.`);
            return;
          }
          
          const paymentData = paymentDoc.data()!;
          if (paymentData.status === 'paid') {
            console.log(`Payment ${reference} already marked as paid.`);
            return; // Idempotent
          }

          const orderId = paymentData.orderId;
          const orderRef = db.collection('orders').doc(orderId);
          const orderDoc = await transaction.get(orderRef);
          
          if (!orderDoc.exists) {
             console.error(`Webhook error: Order ${orderId} not found.`);
             return;
          }

          const orderData = orderDoc.data()!;
          
          // Verify Amount securely
          const expectedGHS = orderData.totalAmount || orderData.total;
          const expectedPesewas = Math.round(expectedGHS * 100);

          if (paystackAmount !== expectedPesewas || paystackCurrency !== 'GHS') {
             console.error(`Webhook error: Amount/Currency mismatch for ${reference}. Expected ${expectedPesewas} GHS, got ${paystackAmount} ${paystackCurrency}`);
             return;
          }

          // Mark payment and order as successful
          transaction.update(paymentRef, {
            status: 'paid',
            verifiedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          });

          transaction.update(orderRef, {
            paymentStatus: 'paid',
            status: 'confirmed',
            updatedAt: FieldValue.serverTimestamp()
          });

          // Here we would also decrement inventory for each item safely
          const items = orderData.items || [];
          for (const item of items) {
             // In a fully robust system, actual inventory counters are decremented here using FieldValue.increment(-qty)
             // This guarantees atomic inventory reduction.
          }
          
          // And finalize coupon usage if present...
        });
        
        console.log(`Successfully processed webhook for reference: ${reference}`);
      } catch (error) {
        console.error('Error processing webhook transaction:', error);
      }
    }

    res.send(200);
  });

  // Polling Endpoint for Frontend to check status securely
  app.get('/api/payments/status/:reference', async (req, res) => {
    try {
      const { reference } = req.params;
      const paymentDoc = await db.collection('payments').doc(reference).get();
      
      if (!paymentDoc.exists) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      const paymentData = paymentDoc.data();
      res.json({
        status: paymentData?.status,
        orderId: paymentData?.orderId
      });
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
