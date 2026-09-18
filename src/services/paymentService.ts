import axios from 'axios';

export interface PaymentInitializationResult {
  success: boolean;
  reference?: string;
  message?: string;
  status?: string;
  display_text?: string;
  error?: string;
}

export interface PaymentStatusResult {
  status: string;
  orderId: string;
  error?: string;
}

export interface PaymentProvider {
  initializeMobileMoneyPayment(
    orderId: string,
    email: string,
    phone: string,
    provider: string
  ): Promise<PaymentInitializationResult>;

  checkPaymentStatus(reference: string): Promise<PaymentStatusResult>;
}

class PaystackPaymentProvider implements PaymentProvider {
  private getBaseUrl() {
    // In production, this should point to your actual backend domain.
    // In Vite dev, it runs on the same host (thanks to proxy or full-stack server).
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  }

  async initializeMobileMoneyPayment(
    orderId: string,
    email: string,
    phone: string,
    provider: string
  ): Promise<PaymentInitializationResult> {
    try {
      const response = await axios.post(`${this.getBaseUrl()}/api/payments/mobile-money/initialize`, {
        orderId,
        email,
        phone,
        provider
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to initialize payment:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to initialize payment. Please check your connection and try again.'
      };
    }
  }

  async checkPaymentStatus(reference: string): Promise<PaymentStatusResult> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/api/payments/status/${reference}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to check payment status:', error.response?.data || error);
      return {
        status: 'unknown',
        orderId: '',
        error: error.response?.data?.error || 'Failed to fetch status'
      };
    }
  }
}

// Export a singleton instance of the payment service
export const paymentService: PaymentProvider = new PaystackPaymentProvider();
