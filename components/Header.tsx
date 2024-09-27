"use client";
import Link from "next/link";

import Nav from "@/components/Nav";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const Header = () => {
  const { user, isLoaded } = useUser();

  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <Link href={"/"}>
              <div className="items-center hidden lg:flex font-semibold text-white text-2xl mt-2.5">
                Finance
              </div>
            </Link>
            <Nav />
          </div>
          <ClerkLoaded>
            <UserButton afterSwitchSessionUrl="/" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin size-8 text-slate-400" />
          </ClerkLoading>
        </div>
        <div className="space-y-2 mb-2">
          <h2 className="text-2xl lg:text-4xl text-white font-medium">
            Welcome Back{isLoaded ? ", " : " "}
            {user?.firstName}
          </h2>
          <p className="text-sm lg:text-base text-slate-300">
            This is your financial report.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
