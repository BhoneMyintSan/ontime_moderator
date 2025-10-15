// Temporarily disabled - install pusher package if realtime features are needed
// import Pusher from "pusher";

declare global {
  var pusherClient: any | undefined;
}

function createPusher(): any | null {
  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        "Pusher environment variables are not fully set. Skipping realtime triggers.")
    }
    return null;
  }

  // Pusher disabled - install pusher package to enable
  return null;
  // return new Pusher({
  //   appId: PUSHER_APP_ID,
  //   key: PUSHER_KEY,
  //   secret: PUSHER_SECRET,
  //   cluster: PUSHER_CLUSTER,
  //   useTLS: true,
  // });
}

export function getPusher(): any | null {
  if (global.pusherClient) return global.pusherClient;
  const client = createPusher();
  if (client) {
    global.pusherClient = client;
  }
  return client;
}

export async function emit(channel: string, event: string, data: unknown): Promise<void> {
  const client = getPusher();
  if (!client) return;
  try {
    await client.trigger(channel, event, data as any);
  } catch (err) {
    console.error(`Pusher trigger failed for ${channel}:${event}`, err);
  }
}
