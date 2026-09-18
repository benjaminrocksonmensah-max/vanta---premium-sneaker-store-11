import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { paymentService } from '../../services/paymentService';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Smartphone,
  Check,
  ShoppingBag,
  ExternalLink,
  Building,
  Copy,
  Info,
  Wallet,
  Settings2,
  QrCode,
  Zap
} from 'lucide-react';
import { ShippingAddress, PaymentMethodType, Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    user,
    createOrder,
    initiateOrder,
    finalizeOrder,
    setActivePage,
    setSelectedOrder,
    merchantSettlement,
    updateMerchantSettlement,
    addToast
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'momo_pending' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Quick edit settlement state
  const [editMomoNumber, setEditMomoNumber] = useState(merchantSettlement?.momoNumber || '0557617501');
  const [editAccountName, setEditAccountName] = useState(merchantSettlement?.accountName || 'Derrick Ahinakwah (VANTA GH)');
  const [editBankName, setEditBankName] = useState(merchantSettlement?.bankName || 'Stanbic Bank Ghana');
  const [editBankAccountNumber, setEditBankAccountNumber] = useState(merchantSettlement?.bankAccountNumber || '9040003482910');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveQuickConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantSettlement({
      momoNumber: editMomoNumber,
      accountName: editAccountName,
      bankName: editBankName,
      bankAccountNumber: editBankAccountNumber
    });
    setIsConfigModalOpen(false);
  };

  // Address state - dynamically derived from authenticated user
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const existing = user?.addresses?.[0];
    if (existing) {
      return {
        fullName: existing.fullName || user?.fullName || user?.name || '',
        email: existing.email || user?.email || '',
        phone: existing.phone || user?.phone || '',
        street: existing.street || existing.addressLine1 || '',
        city: existing.city || '',
        state: existing.state || existing.stateOrRegion || '',
        postalCode: existing.postalCode || '',
        country: existing.country || 'United States'
      };
    }
    return {
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States'
    };
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const safeCartTotal =
    typeof cartTotal === 'number' && !isNaN(cartTotal)
      ? cartTotal
      : cart.reduce((a, b) => a + (b.product?.price ?? 0) * (b.quantity ?? 1), 0);
  const safeDiscountAmount =
    typeof discountAmount === 'number' && !isNaN(discountAmount) ? discountAmount : 0;
  const shippingCost = shippingMethod === 'standard' ? (safeCartTotal >= 200 ? 0 : 15) : 25;

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('momo');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('981');
  const [momoNumber, setMomoNumber] = useState(user?.phone || '024 123 4567');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'airteltigo'>('mtn');
  const [bankSenderRef, setBankSenderRef] = useState('');

  // Calculations
  const finalTotal = Math.max(0, safeCartTotal - safeDiscountAmount + shippingCost);

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Bag is Empty</h2>
        <p className="text-zinc-400 text-sm mb-6">Select a silhouette before proceeding to checkout.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    if (paymentMethod === 'momo') {
      try {
        if (!momoNumber) {
          addToast('Payment Error', 'Please enter your Mobile Money number.', 'error');
          setIsProcessing(false);
          return;
        }

        const pendingOrder = await initiateOrder(shippingAddress, shippingCost, paymentMethod);
        
        // Use user email or guest fallback
        const email = shippingAddress.email || 'guest@vanta.store';
        
        const initResult = await paymentService.initializeMobileMoneyPayment(
          pendingOrder.id,
          email,
          momoNumber,
          momoProvider
        );

        if (initResult.success && initResult.reference) {
          setPaymentReference(initResult.reference);
          setCompletedOrder(pendingOrder); // temporarily hold the order
          setStep('momo_pending');
        } else {
          addToast('Payment Failed', initResult.error || 'Could not initiate payment.', 'error');
          setIsProcessing(false);
        }
      } catch (e: any) {
        addToast('Payment Error', 'An unexpected error occurred.', 'error');
        setIsProcessing(false);
      }
    } else {
      addToast('Configuration Error', 'This payment method is not configured for production. Please use Mobile Money.', 'error');
      setIsProcessing(false);
    }
  };

  // Poll for Mobile Money Payment Status
  useEffect(() => {
    let interval: any;
    if (step === 'momo_pending' && paymentReference && completedOrder) {
      interval = setInterval(async () => {
        const statusResult = await paymentService.checkPaymentStatus(paymentReference);
        if (statusResult.status === 'paid' || statusResult.status === 'success') {
          clearInterval(interval);
          finalizeOrder(completedOrder);
          setStep('confirmation');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsProcessing(false);
        } else if (statusResult.status === 'failed' || statusResult.status === 'abandoned') {
          clearInterval(interval);
          addToast('Payment Failed', 'Your payment was not successful or was cancelled.', 'error');
          setStep('payment');
          setIsProcessing(false);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, paymentReference, completedOrder]);

  // Step: MoMo Pending Wait Screen
  if (step === 'momo_pending') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
        <h2 className="text-2xl font-bold text-white">Awaiting Authorization</h2>
        <p className="text-zinc-400">
          We have sent a prompt to your phone. Please authorize the payment of <strong>GH₵{completedOrder?.total.toFixed(2)}</strong>.
        </p>
        <p className="text-xs text-amber-400 font-mono">
          Do not close this page. We are securely waiting for confirmation from {momoProvider.toUpperCase()}.
        </p>
      </div>
    );
  }

  // Step 3: Order Confirmation Screen
  if (step === 'confirmation' && completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
          PAYMENT & VAULT ALLOCATION CONFIRMED
        </span>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-['Syne',sans-serif]">
          Thank you for moving different.
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mt-3">
          Your order has been encrypted and scheduled for precision dispatch from our flagship fulfillment vault.
        </p>

        {/* Order Details Card */}
        <div className="mt-8 p-6 sm:p-8 bg-[#111114] border border-zinc-800 rounded-3xl text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
            <div>
              <span className="text-xs text-zinc-500 font-mono">ORDER IDENTIFIER</span>
              <h3 className="text-lg font-black text-white font-mono">{completedOrder.id}</h3>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-zinc-500 font-mono">TRACKING NUMBER</span>
              <p className="text-xs font-mono text-zinc-300 font-semibold">{completedOrder.trackingNumber}</p>
            </div>
          </div>

          {/* Direct Settlement Confirmation Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Direct Merchant Settlement Confirmed
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  DEPOSITED
                </span>
              </div>
              <p className="text-zinc-300 text-[11px]">
                Payment of <strong className="text-white font-mono">GH₵{(completedOrder.total || 0).toFixed(2)}</strong> has been processed and routed directly to registered store merchant <strong>{merchantSettlement.accountName}</strong> via <strong>{completedOrder.paymentMethod === 'bank_transfer' ? `${merchantSettlement.bankName} (Acc: ${merchantSettlement.bankAccountNumber})` : `${merchantSettlement.momoNetwork} (${merchantSettlement.momoNumber})`}</strong>.
              </p>
            </div>
          </div>

          {/* Purchased silhouettes */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Silhouettes Allocated
            </span>
            {completedOrder.items.map((item) => {
              const itemSize = item.selectedSize || item.size || 'Standard';
              const itemColor = item.selectedColor || item.color || { name: 'Standard', hex: '#111', imageIndex: 0 };
              const itemPrice = item.product?.price ?? 0;
              const itemQty = item.quantity || 1;
              return (
                <div
                  key={`${item.id || item.product?.id || Math.random()}-${itemSize}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-850"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-zinc-950 p-1 shrink-0">
                      <img src={item.product?.images?.[0] || ''} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.product?.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {itemColor.name} • {itemSize} • Qty: {itemQty}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    GH₵{((itemPrice * itemQty) || 0).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Destination & Delivery date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">Destination Address</span>
              <p className="text-zinc-300 font-medium">
                {completedOrder.shippingAddress?.fullName}<br />
                {completedOrder.shippingAddress?.street || completedOrder.shippingAddress?.addressLine1}<br />
                {completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.country}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Estimated Arrival</span>
              <p className="text-white font-bold">{completedOrder.estimatedDelivery || completedOrder.estimatedDeliveryDate}</p>
              <span className="text-[11px] text-emerald-400 block mt-1">
                Embedded with NFC authenticity credentials
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setSelectedOrder(completedOrder);
              setActivePage('order-tracking');
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Track Order Live
          </button>
          <button
            onClick={() => setActivePage('shop')}
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setActivePage('shop')}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Syne',sans-serif]">
            Encrypted Checkout
          </h1>
          <p className="text-xs text-zinc-400">Step {step === 'shipping' ? '1 of 2: Delivery & Contact' : '2 of 2: Payment'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Step 1 or Step 2 */}
        <div className="lg:col-span-7 space-y-6">
          {step === 'shipping' && (
            <div className="p-6 sm:p-8 bg-[#111114] border border-zinc-800 rounded-3xl space-y-6">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                1. Delivery & Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number (For Courier SMS)</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="Street name and suite / apartment number"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">State / Region</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Country</label>
                <select
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="Ghana">Ghana</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              {/* Shipping Tier Selection */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white block">
                  Delivery Speed
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-white bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold">Standard Vault Express</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {cartTotal >= 200 ? 'FREE' : 'GH₵15'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">3-5 business days delivery</p>
                  </div>

                  <div
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-white bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold">DHL Priority Air</span>
                      <span className="text-xs font-mono font-bold text-white">GH₵25</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">1-2 business days expedited</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6 sm:p-8 bg-[#111114] border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>2. Select Direct Payment Protocol</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Payments are routed directly to the verified merchant vault account
                  </p>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs text-zinc-400 hover:text-white underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-400 bg-blue-400/10 text-blue-300 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>Direct Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-white bg-zinc-800 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-white bg-zinc-800 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>
              </div>

              {/* Mobile Money Fields */}
              {paymentMethod === 'momo' && (
                <div className="space-y-4 pt-1">
                  {/* Direct Merchant Recipient Card */}
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <Wallet className="w-4 h-4" />
                        <span>Direct Merchant Recipient Account</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        VERIFIED STORE ACCOUNT
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-mono block">RECIPIENT NAME</span>
                        <span className="text-white font-bold">{merchantSettlement.accountName}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block">DIRECT MOMO NUMBER</span>
                          <span className="text-amber-300 font-mono font-bold">{merchantSettlement.momoNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(merchantSettlement.momoNumber, 'momo_num')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === 'momo_num' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                      Funds are transferred directly to this merchant number via GhIPSS instant settlement. Enter your mobile number below to receive the STK push prompt.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMomoProvider('mtn')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        momoProvider === 'mtn'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      MTN MoMo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomoProvider('telecel')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        momoProvider === 'telecel'
                          ? 'border-rose-400 bg-rose-400/10 text-rose-300'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      Telecel
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomoProvider('airteltigo')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        momoProvider === 'airteltigo'
                          ? 'border-blue-400 bg-blue-400/10 text-blue-300'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                      }`}
                    >
                      AirtelTigo
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Your Mobile Money Phone Number (For PIN Prompt)
                    </label>
                    <input
                      type="tel"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      placeholder="e.g. 024 XXX XXXX"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      An instant authorization pop-up will appear on your phone screen after clicking Authorize.
                    </span>
                  </div>
                </div>
              )}

              {/* Direct Bank Transfer Fields */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-4 pt-1">
                  {/* Direct Bank Account Box */}
                  <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <Building className="w-4 h-4" />
                        <span>Direct Merchant Bank Deposit</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        GHIPSS INSTANT CLEARING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-mono block">BANK NAME</span>
                        <span className="text-white font-bold">{merchantSettlement.bankName}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block">ACCOUNT NUMBER</span>
                          <span className="text-blue-300 font-mono font-bold">{merchantSettlement.bankAccountNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(merchantSettlement.bankAccountNumber, 'bank_acc')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === 'bank_acc' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-mono block">ACCOUNT HOLDER</span>
                        <span className="text-white font-bold">{merchantSettlement.accountName}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-mono block">BRANCH / SORT CODE</span>
                        <span className="text-zinc-300 font-mono">{merchantSettlement.bankBranch || 'Accra Main Branch (GHIPSS)'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Transfer exact total <strong className="text-white font-mono">GH₵{(finalTotal || 0).toFixed(2)}</strong> to the account details above via your mobile banking app or online banking.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Sender Name or Transaction Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={bankSenderRef}
                      onChange={(e) => setBankSenderRef(e.target.value)}
                      placeholder="e.g. Derrick / Stanbic Ref #89201"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              )}

              {/* Credit Card Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">CVC Code</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit TLS Direct Bank Encryption via 3D Secure 2.0</span>
                  </span>
                </div>
              )}

              {/* Apple Pay Notice */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-center space-y-2">
                  <Lock className="w-6 h-6 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-300">
                    Authenticate biometric payment via Touch ID / Face ID on your device.
                  </p>
                </div>
              )}

              {/* Store Owner Quick Configuration Trigger */}
              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-zinc-850">
                <span className="text-zinc-500">
                  Store Owner: Receiving to <strong>{merchantSettlement.accountName}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>Configure Direct Recipient</span>
                </button>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order — GH₵{(finalTotal || 0).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Merchant Config Modal */}
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span>Direct Merchant Recipient Settings</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Set the account where all customer payments are directly deposited
                  </p>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveQuickConfig} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Merchant / Account Holder Name</label>
                  <input
                    type="text"
                    value={editAccountName}
                    onChange={(e) => setEditAccountName(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Direct Mobile Money Number</label>
                  <input
                    type="tel"
                    value={editMomoNumber}
                    onChange={(e) => setEditMomoNumber(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editBankName}
                    onChange={(e) => setEditBankName(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={editBankAccountNumber}
                    onChange={(e) => setEditBankAccountNumber(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Save & Apply Direct Recipient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Sidebar: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#111114] border border-zinc-800 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-zinc-800">
              Allocated Silhouettes ({cart.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {cart.map((item) => {
                const itemSize = item.selectedSize || item.size || 'Standard';
                const itemColor = item.selectedColor || item.color || { name: 'Standard', hex: '#111', imageIndex: 0 };
                const itemPrice = item.product?.price ?? 0;
                const itemQty = item.quantity || 1;
                return (
                  <div
                    key={`${item.id || item.product?.id || Math.random()}-${itemSize}-${itemColor.name}`}
                    className="flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-950 p-1 shrink-0">
                        <img
                          src={item.product?.images?.[itemColor.imageIndex || 0] || item.product?.images?.[0] || ''}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{item.product?.name}</h4>
                        <p className="text-zinc-500 text-[11px]">{itemColor.name} • {itemSize} • Qty {itemQty}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">
                      GH₵{((itemPrice * itemQty) || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-zinc-850 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">GH₵{(safeCartTotal || 0).toFixed(2)}</span>
              </div>
              {safeDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher Discount</span>
                  <span className="font-mono">-GH₵{(safeDiscountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Priority Air'})</span>
                <span className="font-mono text-white">
                  {shippingCost === 0 ? 'FREE' : `GH₵${(shippingCost || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-zinc-800 text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="font-mono">GH₵{(finalTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
