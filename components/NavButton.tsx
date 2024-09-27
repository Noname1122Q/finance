import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavButtonProps = {
  label: string;
  href: string;
  isActive: boolean;
};

const NavButton: React.FC<NavButtonProps> = ({ label, href, isActive }) => {
  return (
    <Button
      asChild
      size={"sm"}
      variant={"outline"}
      className={cn(
        "w-full lg:w-auto font-normal justify-between hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
        isActive ? "bg-white/10 text-white" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
