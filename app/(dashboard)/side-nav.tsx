"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PlusCircle, Tags } from "lucide-react";

const items = [
  {
    title: "Posts",
    href: "/posts",
    icon: FileText,
  },
  {
    title: "Comments",
    href: "/comments",
    icon: MessageSquare,
  },
  {
    title: "Tags",
    href: "/tags",
    icon: Tags,
  },
  {
    title: "New Post",
    href: "/posts/new",
    icon: PlusCircle,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
