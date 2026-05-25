import { cookies } from "next/headers";

async function getOrCreateSessionId() {
    const sessionId = await getSessionId()

    if (sessionId) {
        return sessionId
    }

    return await setSessionId()
}

async function getSessionId(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get("sessionId")?.value || null
}

async function setSessionId(sessionId?: string): Promise<string> {
    const cookieStore = await cookies()
    const id = sessionId || crypto.randomUUID().slice(-7)
    cookieStore.set("sessionId", id, { httpOnly: true, sameSite: "strict" })
    return id
}

export { getOrCreateSessionId, getSessionId, setSessionId };

