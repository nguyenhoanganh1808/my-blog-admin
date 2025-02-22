import Link from "next/link";

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Blog Admin</span>
      </Link>
    </div>
  );
}
