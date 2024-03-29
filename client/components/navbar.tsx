import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 p-5">
      <div className="px-4 h-14 flex items-center justify-between">
        <Link className="font-semibold text-2xl" href="/">
          Scryer
        </Link>
        <Link href="/auth">
          <Button size="default" variant="outline">
            Sign in
          </Button>
        </Link>
      </div>
    </nav>
  );
}
