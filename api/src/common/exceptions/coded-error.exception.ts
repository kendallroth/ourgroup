import { HttpException, HttpStatus } from "@nestjs/common";

/** Internal API error with code for app (400) */
export class CodedError extends HttpException {
  /** Error code string (useful with error map in web app) */
  code: string;

  /**
   * Internal error wrapper
   *
   * @param {string} code    - Error code string
   * @param {string} message - Error message
   * @param {number} status  - HTTP status
   */
  constructor(code: string, message?: string, status: number = HttpStatus.BAD_REQUEST) {
    super(
      {
        code,
        message,
        statusCode: status,
      },
      status,
    );

    this.code = code;
  }
}
