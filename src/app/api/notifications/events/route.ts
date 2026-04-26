import { auth } from "@/auth";
import { NotificationService } from "@/services/notification.service";

export const dynamic = "force-dynamic";

function encodeEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  const userId = session.user.id;
  let interval: ReturnType<typeof setInterval> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(encodeEvent(event, data)));
      };

      const pushNotifications = async () => {
        try {
          const notifications = await NotificationService.getUndeliveredForUser({
            userId,
            limit: 10,
          });

          for (const notification of notifications) {
            send("notification", notification);
          }
        } catch (error) {
          console.error("Notification SSE error:", error);
          send("error", { message: "Notification stream failed" });
        }
      };

      send("connected", { ok: true });
      await pushNotifications();

      interval = setInterval(pushNotifications, 5000);
      heartbeat = setInterval(() => send("heartbeat", { at: Date.now() }), 25000);
    },
    cancel() {
      if (interval) clearInterval(interval);
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
