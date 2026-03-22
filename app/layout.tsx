import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { DemoUserPicker } from "@/components/demo-user-picker";
import { getCurrentDemoUser, listDemoUsers } from "@/lib/demo-user";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immigration Q&A MVP",
  description: "Canadian immigration Q&A MVP with AI answers and consultant handoff.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentDemoUser();
  const users = listDemoUsers();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ backgroundColor: "#eff6ff", colorScheme: "light" }}
    >
      <body
        className="min-h-full bg-sky-50 text-black"
        style={{ backgroundColor: "#eff6ff", color: "#000000" }}
      >
        <div
          className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: "#eff6ff", color: "#000000" }}
        >
          <header className="sticky top-0 z-20 mt-4 rounded-3xl border border-sky-200 bg-white px-5 py-5 shadow-sm lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight text-black">
                <span className="text-sky-700">Immigration</span> Q&amp;A
            </Link>

              <nav className="flex flex-wrap items-center gap-3 text-sm text-black">
                <Link
                  href="/"
                  className="rounded-full bg-sky-50 px-3 py-2 text-black hover:bg-sky-100"
                >
                  Feed
                </Link>
                <Link
                  href="/questions/new"
                  className="rounded-full bg-sky-50 px-3 py-2 text-black hover:bg-sky-100"
                >
                  Ask a question
                </Link>
                <Link
                  href="/consultants"
                  className="rounded-full bg-sky-50 px-3 py-2 text-black hover:bg-sky-100"
                >
                  Consultants
                </Link>
                <Link
                  href="/applier"
                  className="rounded-full border border-sky-300 bg-sky-100 px-4 py-2 font-semibold text-black shadow-sm transition hover:bg-sky-200"
                >
                  Open Applier AI
                </Link>
                <Link
                  href="/onboarding"
                  className="rounded-full bg-sky-50 px-3 py-2 text-black hover:bg-sky-100"
                >
                  Demo setup
                </Link>
                {currentUser ? (
                  <>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-black">
                      {currentUser.displayName} · {currentUser.role}
                    </span>
                    <DemoUserPicker currentUserId={currentUser.id} users={users} />
                  </>
                ) : null}
              </nav>
            </div>
          </header>

          <main className="flex-1 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
