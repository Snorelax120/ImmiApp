import { DemoUserPicker } from "@/components/demo-user-picker";
import { getCurrentDemoUser, listDemoUsers } from "@/lib/demo-user";

export default async function OnboardingPage() {
  const currentUser = await getCurrentDemoUser();
  const users = listDemoUsers();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-[28px] bg-white px-6 py-10 shadow-[0_10px_28px_rgba(16,19,40,0.05)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.26em] text-[#8a90a7]">
          The sovereign standard
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#101328]">
          Begin your journey North.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d7288]">
          In this demo build, persona switching replaces full authentication.
          Choose a client to ask questions and rate sessions, or switch to a
          consultant persona to respond as an expert.
        </p>
      </section>

      <section className="rounded-[24px] border border-[rgba(16,19,40,0.08)] bg-white p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)]">
        {currentUser ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#101328]">
                Active demo persona
              </h2>
              <p className="mt-1 text-sm text-[#6d7288]">
                {currentUser.displayName} is currently acting as a{" "}
                {currentUser.role}.
              </p>
            </div>
            <DemoUserPicker currentUserId={currentUser.id} users={users} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <article
            key={user.id}
            className={`rounded-[28px] p-6 shadow-[0_10px_28px_rgba(16,19,40,0.05)] ${
              user.role === "consultant" ? "bg-[#081b4b] text-white" : "bg-white"
            }`}
          >
            <p
              className={`text-xs font-medium uppercase tracking-[0.22em] ${
                user.role === "consultant" ? "text-[#c8cee0]" : "text-[#8a90a7]"
              }`}
            >
              {user.role === "consultant" ? "I'm a consultant" : "I'm a client"}
            </p>
            <h2
              className={`mt-3 text-2xl font-semibold tracking-[-0.03em] ${
                user.role === "consultant" ? "text-white" : "text-[#101328]"
              }`}
            >
              {user.displayName}
            </h2>
            <p
              className={`mt-3 text-sm leading-7 ${
                user.role === "consultant" ? "text-[#d6dbeb]" : "text-[#6d7288]"
              }`}
            >
              {user.bio}
            </p>
            {user.expertiseTags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.expertiseTags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === "consultant"
                        ? "bg-[#15306f] text-[#eef1f8]"
                        : "bg-[#eceff6] text-[#41527f]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <p className="text-center text-sm text-[#8a90a7]">
        &ldquo;Our mission is to bridge the gap between your ambition and your
        arrival.&rdquo;
      </p>
    </div>
  );
}
