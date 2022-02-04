import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

// Utilities
import { AuthModule } from "@modules/auth/auth.module";
import { Account } from "./entities";
import { AccountController } from "./controllers";
import { AccountService } from "./services";

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  imports: [
    // External modules
    PassportModule.register({ defaultStrategy: "jwt", property: "account" }),
    TypeOrmModule.forFeature([Account]),
    // Local modules
    forwardRef(() => AuthModule),
  ],
  providers: [AccountService],
})
export class AccountModule {}
