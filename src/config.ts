import { config } from "dotenv";
import { resolve } from "path";

export const NODE_ENV = process.env.NODE_ENV || "development";

const envFile = NODE_ENV === "development" ? ".env.development" : ".env";

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

export const PORT = process.env.PORT;
export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_PUBLIC_CLIENT as string;
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET as string;
export const NEXT_BASE_URL = process.env.NEXT_BASE_URL;