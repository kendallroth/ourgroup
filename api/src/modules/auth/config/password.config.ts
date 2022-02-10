import { registerAs } from "@nestjs/config";

// Types
import { IPasswordConfig } from "../types";

// NOTE: Any changes to these values will break all previously generated hashes!
const passwordConfig: IPasswordConfig = {
  hashRounds: 12,
  hashSaltRounds: 12,
};

export default registerAs("password", () => ({ ...passwordConfig }));
