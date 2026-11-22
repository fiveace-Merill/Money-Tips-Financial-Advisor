import Link from "next/link";
import AuthForm from "@/features/auth/components/AuthForm";
import AuthShell from "@/features/auth/components/AuthShell";

export const metadata = {
  title: "Sign up | Money Tips",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your financial journey with a clear plan and an advisor in your pocket."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold landing-accent-text hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
