import { HttpException, HttpStatus } from "@nestjs/common";

/** Internal API error with throttling information (429) */
export class ThrottleError extends HttpException {
  /** Time to wait unil throttle ends */
  wait: number;

  /**
   * Internal error wrapper
   *
   * @param {string} message - Error message
   * @param {number} wait    - Time to wait until throttle ends
   */
  constructor(message: string, wait: number) {
    super(
      {
        message,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        wait,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );

    this.wait = wait;
  }
}
