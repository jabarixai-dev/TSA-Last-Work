import { getStore } from "@netlify/blobs";

const store = getStore("tsa-media");

export default async (request) => {
  try {
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

    const key = new URL(request.url).searchParams.get("key");
    if (!key || !key.startsWith("gallery/")) return new Response("Not found", { status: 404 });

    const blob = await store.get(key, { type: "blob" });
    if (!blob) return new Response("Not found", { status: 404 });

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error(error);
    return new Response("Media error", { status: 500 });
  }
};
