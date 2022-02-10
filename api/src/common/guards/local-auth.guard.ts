import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Support local account login route
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
