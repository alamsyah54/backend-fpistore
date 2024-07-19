import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  secret: process.env.JWT_SECRET_KEY!,
};
