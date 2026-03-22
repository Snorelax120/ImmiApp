import { ApplierChat } from "@/components/applier-chat";
import {
  createInitialApplierSessionState,
  createInitialAssistantMessage,
} from "@/lib/applier-chat";
import { getCurrentDemoUser } from "@/lib/demo-user";

export default async function ApplierPage() {
  const currentUser = await getCurrentDemoUser();

  return (
    <div className="mx-auto max-w-6xl">
      <ApplierChat
        currentUserLabel={
          currentUser
            ? `${currentUser.displayName} (${currentUser.role})`
            : "No demo user selected"
        }
        initialMessages={[createInitialAssistantMessage()]}
        initialSession={createInitialApplierSessionState()}
      />
    </div>
  );
}
