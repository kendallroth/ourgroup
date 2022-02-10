import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Ensure routes are protected with JWT token authentication
 */
@Injectable()
export class AccountAuthenticatedGuard extends AuthGuard("jwt") {}
