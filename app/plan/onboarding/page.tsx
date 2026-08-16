import { OnboardingFlow } from "@/components/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <main className="page-shell onboarding-page">
      <OnboardingFlow />
      <p className="privacy-note">No account needed. Your answers are used only to shape this plan.</p>
    </main>
  );
}
