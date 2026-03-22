import { ApplierWizard } from "@/components/applier-wizard";
import { getCurrentDemoUser } from "@/lib/demo-user";
import { getApplierCatalog } from "@/lib/ircc-forms";

export default async function ApplierPage() {
  const currentUser = await getCurrentDemoUser();
  const catalog = getApplierCatalog();

  return (
    <div className="mx-auto max-w-6xl">
      <ApplierWizard
        catalog={catalog}
        currentUserLabel={
          currentUser
            ? `${currentUser.displayName} (${currentUser.role})`
            : "No demo user selected"
        }
      />
    </div>
  );
}
