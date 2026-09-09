import { getStore } from "@netlify/blobs";

const store = getStore("tsa-content");

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
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

const allowedSections = [
  "index",
  "about",
  "academics",
  "admissions",
  "contact",
  "news",
  "gallery",
  "administration",
  "programs"
];

export default async (request) => {
  try {
    const url = new URL(request.url);
    const section = url.searchParams.get("section");

    if (request.method === "GET") {
      if (section === "__admin_check") {
        const user = await getUser(request);
        if (!user) return json({ error: "Unauthorized. Please log in." }, 401);
        return json({ success: true, email: user.email || "" });
      }
      if (section) {
        if (!allowedSections.includes(section)) {
          return json({ error: "Invalid section" }, 400);
        }
        return json((await store.get(section, { type: "json" })) || {});
      }

      const results = {};
      await Promise.all(
        allowedSections.map(async (name) => {
          results[name] = (await store.get(name, { type: "json" })) || {};
        })
      );
      return json(results);
    }

    if (request.method === "POST") {
      const user = await getUser(request);
      if (!user) return json({ error: "Unauthorized. Please log in." }, 401);

      const body = await request.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ error: "Invalid JSON body" }, 400);
      }

      if (!body.section || body.data === undefined) {
        return json({ error: "section and data are required" }, 400);
      }

      if (!allowedSections.includes(body.section)) {
        return json({ error: "Invalid section" }, 400);
      }

      await store.setJSON(body.section, body.data);

      return json({
        success: true,
        section: body.section
      });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error(error);
    return json({ error: "Internal server error" }, 500);
  }
};
