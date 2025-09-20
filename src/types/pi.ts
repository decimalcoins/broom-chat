// Pi Network SDK global type definitions
declare global {
  interface Window {
    Pi: {
      init: (config: any) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => void) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
        };
      }>;
      createPayment: (payment: {
        amount: number;
        memo: string;
        metadata: any;
      }, callbacks: {
        onReadyForServerApproval: (paymentId: string) => void;
        onReadyForServerCompletion: (paymentId: string, txid: string) => void;
        onCancel: (paymentId: string) => void;
        onError: (error: any, payment: any) => void;
      }) => Promise<any>;
    };
  }
}

export {};