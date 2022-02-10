import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// Utilities
import { Account } from "@modules/account/entities";
import { AuthService } from "@modules/auth/services";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  /** Validate account credentials and attach account to request */
  async validate(email: string, password: string): Promise<Account | null> {
    const user = await this.authService.getLocalAccount({ email, password });
    if (!user) {
      throw new UnauthorizedException("Invalid authentication credentials");
    }
    return user;
  }
}
