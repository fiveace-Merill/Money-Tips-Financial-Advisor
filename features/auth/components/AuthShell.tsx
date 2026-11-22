import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChartNoAxesCombined,
  LockKeyhole,
  MessagesSquare,
} from "lucide-react";

const highlights = [
  {
    icon: MessagesSquare,
    title: "Talk it through",
    description: "Ask about budgets, savings or investments in plain language.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Plan with clarity",
    description: "Turn numbers into a practical plan you can actually follow.",
  },
  {
    icon: LockKeyhole,
    title: "Your space",
    description: "Your account keeps your details ready whenever you return.",
  },
];

export default function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="landing-glow landing-glow--primary -left-40 -top-40 size-[28rem]"
      />
      <div
        aria-hidden="true"
        className="landing-glow landing-glow--tertiary -bottom-52 -right-32 size-[30rem]"
      />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_minmax(380px,460px)] lg:items-center lg:gap-20 lg:py-12">
        <section className="hidden lg:block">
          <Link
            href="/"
            aria-label="Money Tips home"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Image src="/brand_logo.png" width={48} height={48} alt="" priority />
            <span className="text-2xl font-bold tracking-tight text-on-background">
              Money Tips
            </span>
          </Link>

          <h2 className="mt-12 max-w-xl text-4xl font-bold leading-tight tracking-tight text-on-background">
            A calmer way to make sense of your money.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-on-background/75">
            Your AI financial advisor is here for the questions you used to put
            off. Get clear, practical guidance without the jargon.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, title: itemTitle, description }) => (
              <li key={itemTitle} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-container/40 text-on-primary-container">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-on-background">{itemTitle}</p>
                  <p className="mt-0.5 text-sm text-on-background/70">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-on-background transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back home
          </Link>

          <div className="landing-glass mt-4 rounded-3xl border border-background-container p-6 shadow-xl shadow-primary/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] landing-accent-text">
              Money Tips
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-on-background sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-on-background/75">
              {subtitle}
            </p>

            <div className="mt-7">{children}</div>

            <div className="mt-7 border-t border-background-container pt-5 text-sm text-on-background/75">
              {footer}
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-on-background/60">
            Illustrative guidance only. Money Tips is not a substitute for
            professional financial advice.
          </p>
        </section>
      </div>
    </main>
  );
}
