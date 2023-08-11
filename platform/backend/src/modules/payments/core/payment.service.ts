export interface PaymentService {
    createPayment(amount: number, currency: string, source: string): Promise<any>;
    getPayment(paymentId: string): Promise<any>;
    getInstallments(paymentAmount: number, currency: string): Promise<any>;
}