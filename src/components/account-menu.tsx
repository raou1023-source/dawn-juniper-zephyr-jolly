import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/use-t";

export function AccountMenu() {
  const { isPending } = useCurrentUserState();
  const t = useT();
  if (isPending) {
    return <div className="h-8 w-16 rounded-md bg-elevated" />;
  }
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link
          to="/login"
          className="inline-flex h-8 items-center rounded-md bg-elevated px-2.5 text-xs text-muted hover:text-fg"
        >
          {t("login")}
        </Link>
      </SignedOut>
    </>
  );
}
