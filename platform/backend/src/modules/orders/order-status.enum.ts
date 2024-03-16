/**
 * Enum representing the status of an order.
 */
export enum OrderStatus {
  /**
   * The order has been paid.
   */
  PAID = 'PAID',

  /**
   * The order is pending and awaiting processing.
   */
  PENDING = 'PENDING',

  /**
   * The order has been canceled.
   */
  CANCELLED = 'CANCELLED',

  /**
   * The order has been failed.
   */
  FAILED = 'FAILED',
}
