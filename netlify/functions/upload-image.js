import { getStore } from "@netlify/blobs";

const store = getStore("tsa-media");

async function getUser(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;

  const origin = new URL(request.url).origin;
  const response = await fetch(`${origin}/.netlify/identity/user`, {
    headers: { Authorization: auth }
  });

  if (!response.ok) return null;
  return response.json();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

export default async (request) => {
  try {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const user = await getUser(request);
    if (!user) return json({ error: "Unauthorized. Please log in." }, 401);

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "No image file was provided." }, 400);
    if (!file.type.startsWith("image/")) return json({ error: "Only image files are allowed." }, 400);
    if (file.size > 8 * 1024 * 1024) return json({ error: "Image is too large. Maximum 8 MB." }, 400);

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const safeExt = ext || "jpg";
    const key = `gallery/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

    await store.set(key, file, {
      metadata: { contentType: file.type }
    });

    return json({
      success: true,
      key,
      url: `/.netlify/functions/media?key=${encodeURIComponent(key)}`
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Image upload failed." }, 500);
  }
};
