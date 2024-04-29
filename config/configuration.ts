import { config } from "dotenv";

const env = process.env.NODE_ENV || false;
if (!env) process.exit(100);

config({ path: `bin/.env.${env}` });

export default () => ({
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_Name: process.env.DB_NAME,
});
