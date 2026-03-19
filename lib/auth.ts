import { authClient } from "@/lib/auth-client"; // your existing client config

export async function getSession(headers: Headers) {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/get-session`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}