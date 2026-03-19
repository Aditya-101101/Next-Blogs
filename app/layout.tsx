import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getToken } from "@/lib/auth-server";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Next Blogs",
  description: "Share your thoughts and ideas to the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">

            <ConvexClientProvider >{children}</ConvexClientProvider>

          </main>
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
