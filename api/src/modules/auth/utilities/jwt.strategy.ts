import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

// Utilities
import { AccountService } from "@modules/account/services";
import { jwtConfig as _jwtConfig } from "../config";
import { IJwtValidation } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(_jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof _jwtConfig>,
    private readonly accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.jwtSecret,
      usernameField: "email",
    });
  }

  /**
   * Respond to a validated JWT token with the authenticated account
   *
   * @param   payload - JWT validation payload
   * @returns Authenticated account (will be attached to request object)
   */
  async validate(payload: IJwtValidation) {
    // TODO: Determine if any enrichment should be provided to account object!
    return this.accountService.findByEmail(payload.email);
  }
}
