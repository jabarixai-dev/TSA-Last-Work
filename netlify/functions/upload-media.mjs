import { getStore } from "@netlify/blobs";

const store = getStore({ name: "tsa-media" });

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function getUser(request) {
  const auth = request.headers.get("authorization") || "";

  if (!auth.startsWith("Bearer ")) return null;

  const origin = new URL(request.url).origin;

  const response = await fetch(`${origin}/.netlify/identity/user`, {
    headers: {
      Authorization: auth,
    },
  });

  return response.ok ? response.json() : null;
}

function safeName(name) {
  return String(name || "media")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

function contentType(name, fallback) {
  const ext = String(name).split(".").pop().toLowerCase();

  const types = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    mov: "video/quicktime",
  };

  return types[ext] || fallback || "application/octet-stream";
}

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    // GET: retrieve media
    if (request.method === "GET") {
      if (!key || !key.startsWith("media/")) {
        return new Response("Media not found", { status: 404 });
      }

      const result = await store.get(key, {
        type: "arrayBuffer",
      });

      if (!result) {
        return new Response("Media not found", { status: 404 });
      }

      return new Response(result, {
        headers: {
          "Content-Type": contentType(key),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // POST: upload media
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // Require administrator access
    const user = await getUser(request);
    if (!user) {
      return json({ error: "Unauthorized. Please log in." }, 401);
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return json(
        { error: "Please select a file." },
        400
      );
    }

    const type = String(file.type || "");

    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      return json(
        { error: "Only image and video files are allowed." },
        400
      );
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      return json(
        {
          error:
            "File is too large. Maximum upload size is 5 MB. Larger videos can be added by URL.",
        },
        400
      );
    }

    const name = safeName(file.name || "media");

    const mediaKey =
      `media/${crypto.randomUUID()}-${name}`;

    await store.set(
      mediaKey,
      await file.arrayBuffer(),
      {
        metadata: {
          contentType: type,
          uploadedAt: new Date().toISOString(),
          originalName: file.name || "media",
        },
      }
    );

    return json({
      success: true,
      key: mediaKey,
      type: type.startsWith("video/") ? "video" : "image",
      url:
        `${url.origin}/.netlify/functions/upload-media?key=${encodeURIComponent(mediaKey)}`,
    });
  } catch (error) {
    console.error("Media upload error:", error);

    return json(
      {
        error: "Media upload failed.",
        details: error?.message || "Unknown error",
      },
      500
    );
  }
}
