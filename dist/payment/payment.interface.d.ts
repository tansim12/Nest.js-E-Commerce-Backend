export type TPaymentInfo = {
    userId: string;
    shopId: string;
    productId: string;
    paymentStatus: 'pending' | 'confirm' | 'cancel';
    mer_txnid: string;
    cus_email: string;
    cus_phone: string;
    amount: number;
    quantity: number;
    payment_type: string;
    approval_code: string;
};
