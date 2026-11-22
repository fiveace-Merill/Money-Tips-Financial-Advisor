import Link from "next/link";
import AuthForm from "@/features/auth/components/AuthForm";
import AuthShell from "@/features/auth/components/AuthShell";

export const metadata = {
  title: "Log in | Money Tips",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to pick up where you left off with your financial plans."
      footer={
        <>
          New to Money Tips?{" "}
          <Link
            href="/signup"
            className="font-semibold landing-accent-text hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
