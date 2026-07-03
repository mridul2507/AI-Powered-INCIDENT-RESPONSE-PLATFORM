import { registerOTel } from "@vercel/otel";

console.log("instrumentation.ts LOADED");

export function register() {
  console.log("register() CALLED");

  registerOTel({
    serviceName: "ir-assist-backend",
  });

  console.log("registerOTel FINISHED");
}