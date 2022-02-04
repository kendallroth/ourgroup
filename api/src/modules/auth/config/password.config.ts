import { registerAs } from "@nestjs/config";

// Types
import { IPasswordConfig } from "../types";

// NOTE: Any changes to these values will break all previously generated hashes!
const passwordConfig: IPasswordConfig = {
  hashDigest: "sha512",
  hashKeyLength: 64,
  hashRounds: 12,
  hashSaltSize: 24,
};

export default registerAs("password", () => ({ ...passwordConfig }));
