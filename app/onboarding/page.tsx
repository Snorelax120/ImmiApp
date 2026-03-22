import { DemoUserPicker } from "@/components/demo-user-picker";
import { getCurrentDemoUser, listDemoUsers } from "@/lib/demo-user";

export default async function OnboardingPage() {
  const currentUser = await getCurrentDemoUser();
  const users = listDemoUsers();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-black shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
          Demo setup
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Choose a persona instead of signing in.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-black">
          For the hackathon build, auth is replaced with a demo user switcher.
          Pick a client to ask questions and rate sessions, then switch to a
          consultant persona to post expert answers and respond in chat.
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        {currentUser ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                Active demo persona
              </h2>
              <p className="mt-1 text-sm text-black">
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
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black">
              {user.role}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-950">
              {user.displayName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-black">{user.bio}</p>
            {user.expertiseTags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.expertiseTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
