import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";
import { makePgService } from "postgraphile/adaptors/pg";
import { Pool } from "pg";
import { ErrorsAsDataPlugin } from "./plugin";

const pool = new Pool({
  database: process.env.DB_NAME || "library",
  user: process.env.DB_USER || "api_user",
  password: process.env.DB_PASSWORD || "supersecret",
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "5432"),
});

const preset: GraphileConfig.Preset = {
  grafast: {
    timeouts: {
      planning: Number.MAX_SAFE_INTEGER,
      execution: Number.MAX_SAFE_INTEGER,
    },
    explain: true, // DO NOT ENABLE IN PRODUCTION!
  },
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      ignoreRBAC: false,
      subscriptions: false,
      setofFunctionsContainNulls: false,
      showErrorStack: "json",
      extendedErrors: ["hint", "detail", "errcode"],
    }),
  ],

  plugins: [ErrorsAsDataPlugin],
  disablePlugins: [
    "PgMutationCreatePlugin",
    //"PgMutationUpdateDeletePlugin",
  ],

  pgServices: [
    makePgService({
      pool,
      schemas: ["public"],
    }),
  ],

  schema: {
    dontSwallowErrors: true,
  },
};

export default preset;
