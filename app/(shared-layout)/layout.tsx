import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SharedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}