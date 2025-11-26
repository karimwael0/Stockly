import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = Array.from(cookieStore.getAll())
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    
    const session = await auth.api.getSession({
      headers: {
        cookie: cookieHeader,
      } as any,
    });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getUserId(): Promise<number | null> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return null;
  }
  // Better Auth may return string or number IDs, convert to number
  const userId = typeof session.user.id === "string" 
    ? parseInt(session.user.id, 10) 
    : session.user.id;
  return isNaN(userId) ? null : userId;
}

