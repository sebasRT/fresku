import { Hono } from "hono";

const webhook = new Hono();

webhook.get("/", (c) => {
    const mode = c.req.query("hub.mode");
    const challenge = c.req.query("hub.challenge");
    const verifyToken = c.req.query("hub.verify_token");

    if (mode === "subscribe" && verifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
        return c.text(challenge ?? "", 200);
    }

    return c.text("Forbidden", 403);
});

webhook.post("/", async (c) => {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) return c.text("Server misconfigured", 500);

    const signature = c.req.header("X-Hub-Signature-256");
    if (!signature) return c.text("Forbidden", 403);

    const rawBody = await c.req.raw.arrayBuffer();

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(appSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signatureBytes = await crypto.subtle.sign("HMAC", key, rawBody);
    const expectedHash = Array.from(new Uint8Array(signatureBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const receivedHash = signature.replace("sha256=", "");
    if (expectedHash !== receivedHash) return c.text("Forbidden", 403);

    const payload = JSON.parse(new TextDecoder().decode(rawBody));
    console.log("[WhatsApp webhook]", JSON.stringify(payload, null, 2));

    return c.text("OK", 200);
});

export default webhook;
