import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "1m",
};

export default function runStressTest() {
  const res = http.get(
    "http://localhost:3000/api/health"
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}