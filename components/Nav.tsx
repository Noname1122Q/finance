import React, { useState } from "react";
import { useMedia } from "react-use";
import NavButton from "@/components/NavButton";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const routes = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Transactions",
    href: "/transactions",
  },
  {
    label: "Accounts",
    href: "/accounts",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const [isOpen, setIsOpen] = useState(false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((item, i) => (
              <Button
                key={i}
                variant={item.href == pathname ? "secondary" : "ghost"}
                onClick={() => onClick(item.href)}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-2 overflow-x-auto">
      {routes.map((item, i) => (
        <NavButton
          key={i}
          label={item.label}
          href={item.href}
          isActive={pathname == item.href}
        />
      ))}
    </nav>
  );
};

export default Nav;
