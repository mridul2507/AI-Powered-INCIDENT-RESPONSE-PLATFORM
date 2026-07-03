import { registerOTel } from "@vercel/otel";

export function register() {
  console.log("OTEL REGISTERED");

  registerOTel({
    serviceName: "ir-assist-backend",
  });
}