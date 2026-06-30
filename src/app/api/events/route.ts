import { subscribe } from "@/lib/events";

export async function GET() {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      unsubscribe = subscribe((data) => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          unsubscribe?.();
        }
      });
    },

    cancel() {
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}