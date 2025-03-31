import Terminal from "@terminaldotshop/sdk";

const TERMINAL_BEARER_TOKEN = process.env.TERMINAL_DEV_BEARER_TOKEN;

export const client = new Terminal({
  bearerToken: TERMINAL_BEARER_TOKEN, // This is the default and can be omitted
  environment: "dev", // defaults to 'production'
});
