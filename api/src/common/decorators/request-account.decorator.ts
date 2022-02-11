import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Types
import { IAuthenticatedRequest } from "@common/types";

/**
 * Get authenticated account from response
 *
 * NOTE: Decorator must be used in correlation with an auth guard to set "req.account"!
 *         If account has not been attached to the request, it will be null (unexpected)!
 */
export const RequestAccount = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: IAuthenticatedRequest = ctx.switchToHttp().getRequest();
  return request.account ?? null;
});
