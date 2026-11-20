import Link from "next/link";
import { ThemedLandscape } from "@/components/landscape-scene";
import { EmHeading, Pill } from "@/components/landing/section-head";
import { Button } from "@/components/ui/button";
import { GitHubIcon, GoogleIcon } from "@/components/provider-icons";
import { signInWithProvider } from "./actions";

// X dropped for now: its developer platform may require a paid plan. Add it
// back here (and wire its credentials in Supabase Auth) if that changes.
const providers = [
  { id: "google" as const, name: "Google", Icon: GoogleIcon },
  { id: "github" as const, name: "GitHub", Icon: GitHubIcon },
];

const FLOAT_SQUARES = [
  "bottom-[24%] left-[8%] max-sm:hidden",
  "bottom-[18%] left-[calc(8%+52px)] [animation-delay:-3s] max-sm:hidden",
  "bottom-[28%] right-[9%] [animation-delay:-2s] max-sm:hidden",
];

export default function LoginPage() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-[120px]">
      <ThemedLandscape day="sunrise" />

      {FLOAT_SQUARES.map((position) => (
        <span key={position} aria-hidden="true" className={`float-square ${position}`} />
      ))}

      <div className="glass relative flex max-h-full w-full max-w-[440px] flex-col items-center gap-[18px] rounded-panel px-8 py-10 text-center shadow-blue">
        <Pill>No distraction between your studies</Pill>

        <EmHeading
          as="h1"
          title={{ lead: "Pick up where you", em: "left off." }}
          className="text-[clamp(1.8rem,5vh,2.4rem)] leading-[1.08]"
        />

        <p className="text-[0.95rem] text-ink-soft">
          Your streak, your plan and your notes are waiting.
        </p>

        <div className="flex w-full flex-col gap-2.5">
          {providers.map(({ id, name, Icon }) => (
            <form key={id} action={signInWithProvider.bind(null, id)} className="w-full">
              <Button type="submit" variant="quiet" size="pill" className="w-full bg-surface">
                <Icon />
                Continue with {name}
              </Button>
            </form>
          ))}
        </div>

        <p className="text-[0.78rem] leading-relaxed text-ink-soft">
          By continuing you agree to our{" "}
          <Link href="/terms" className="text-moss underline underline-offset-4">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-moss underline underline-offset-4">
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
