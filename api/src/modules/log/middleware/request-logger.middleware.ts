import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Utilities
import { LoggerService } from "../services";

// Types
import { IAuthenticatedRequest, ILoggedRequest } from "@common/types";

/**
 * Log incoming HTTP requests
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext("RequestLogger");
  }

  use(req: ILoggedRequest, res: Response, next: NextFunction) {
    // Request ID can be used to group related logs together (to a request)
    // TODO: Determine how to actually utilize this when logging!
    const requestId = uuidv4();
    req.requestId = requestId;

    const startTime = new Date().getTime();

    // Response status code is not actually set until the response has been completed!
    res.on("finish", () => {
      const requestTime = new Date().getTime() - startTime;
      let accountId = (req as unknown as IAuthenticatedRequest).account?.accountId ?? "";
      accountId = accountId ? ` accountId:${accountId}` : "";
      const method = req.method.padStart(5, " ");
      const routeMessage = `${method} ${res.statusCode} ${req.path} (${requestTime}ms)${accountId}`;
      this.logger.debug(routeMessage);
    });

    next();
  }
}
