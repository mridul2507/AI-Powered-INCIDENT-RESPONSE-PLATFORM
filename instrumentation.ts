import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "ir-assist-backend",
    attributes: {
      "deployment.environment": "production",
      "service.namespace": "my-application-group",
    },
  });
}