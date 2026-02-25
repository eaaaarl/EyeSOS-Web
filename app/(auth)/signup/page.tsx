import SignupForm from "@/features/auth/components/signup-form";
import { EyeSosLogo } from "./eyesos-logo";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/20 p-6 md:p-10">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex justify-center">
          <a href="#" className="flex items-center gap-2 font-medium">
            <EyeSosLogo size="lg" />
          </a>
        </div>
        <div className="w-full">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
