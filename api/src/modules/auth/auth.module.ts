import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

// Utilities
import { AccountModule } from "@modules/account/account.module";
import { jwtConfig, passwordConfig } from "./config";
import { AuthController } from "./controllers";
import { VerificationCode, RefreshToken } from "./entities";
import {
  AuthService,
  ForgotPasswordService,
  PasswordService,
  RefreshTokenService,
  TokenService,
} from "./services";
import { JwtStrategy } from "./utilities";

// NOTE: Non-standard approach necessary to access config in module file
const jwtConfigInstance = jwtConfig();

// key: "property"

@Module({
  controllers: [AuthController],
  exports: [AuthService, PasswordService, TokenService],
  imports: [
    // External modules
    ConfigModule.forFeature(passwordConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.register({
      secret: jwtConfigInstance.jwtSecret,
      signOptions: {
        expiresIn: jwtConfigInstance.jwtExpirySeconds,
      },
    }),
    PassportModule.register({ defaultStrategy: "jwt", property: "account" }),
    TypeOrmModule.forFeature([VerificationCode, RefreshToken]),
    // Local modules
    forwardRef(() => AccountModule),
  ],
  providers: [
    AuthService,
    ForgotPasswordService,
    JwtStrategy,
    PasswordService,
    RefreshTokenService,
    TokenService,
  ],
})
export class AuthModule {}
