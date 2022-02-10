import { registerAs } from "@nestjs/config";

// Types
import { IJwtConfig } from "../types";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT secret missing");

const jwtExpiry = parseInt(process.env.JWT_EXPIRY || "900", 10);

const jwtConfig: IJwtConfig = {
  jwtExpirySeconds: jwtExpiry,
  jwtSecret,
  refreshTokenExpirySeconds: 7 * 24 * 60 * 60, // 7 days
  refreshTokenLength: 64,
  refreshTokenRounds: 12,
};

export default registerAs("jwt", () => ({ ...jwtConfig }));
