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
  title: "Poutine & Paperwork",
  description: "Canadian immigration guidance with AI triage and consultant handoff.",
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
      style={{ backgroundColor: "#f6f4ef", colorScheme: "light" }}
    >
      <body className="min-h-full text-[#1a1c1d]">
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-30 pt-4">
            <div className="rounded-[24px] border border-[rgba(16,19,40,0.08)] bg-[rgba(255,255,255,0.88)] px-5 py-4 shadow-[0_10px_28px_rgba(16,19,40,0.05)] backdrop-blur-xl lg:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <Link
                    href="/"
                    className="block text-xl font-semibold tracking-[-0.03em] text-[#081b4b]"
                  >
                    Poutine & Paperwork
                  </Link>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7982a0]">
                    Professional guidance
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                  <nav className="flex flex-wrap items-center gap-2 text-sm">
                    <Link
                      href="/"
                      className="rounded-full px-4 py-2.5 font-medium text-[#5f667f] transition hover:bg-[#f1efe8]"
                    >
                      Feed
                    </Link>
                    <Link
                      href="/questions/new"
                      className="rounded-full px-4 py-2.5 font-medium text-[#5f667f] transition hover:bg-[#f1efe8]"
                    >
                      Ask a question
                    </Link>
                    <Link
                      href="/consultants"
                      className="rounded-full px-4 py-2.5 font-medium text-[#5f667f] transition hover:bg-[#f1efe8]"
                    >
                      Consultants
                    </Link>
                    <Link
                      href="/applier"
                      className="rounded-full px-4 py-2.5 font-medium text-[#5f667f] transition hover:bg-[#f1efe8]"
                    >
                      Applier AI
                    </Link>
                    <Link
                      href="/onboarding"
                      className="rounded-full px-4 py-2.5 font-medium text-[#5f667f] transition hover:bg-[#f1efe8]"
                    >
                      Demo setup
                    </Link>
                    <Link
                      href="/consultants"
                      className="rounded-md bg-[#081b4b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d276a]"
                      style={{
                        backgroundColor: "#081b4b",
                        color: "#ffffff",
                        WebkitTextFillColor: "#ffffff",
                        opacity: 1,
                      }}
                    >
                      Consultation
                    </Link>
                  </nav>

                  {currentUser ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="rounded-full bg-[#081b4b] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white">
                        {currentUser.displayName} · {currentUser.role}
                      </div>
                      <DemoUserPicker currentUserId={currentUser.id} users={users} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
