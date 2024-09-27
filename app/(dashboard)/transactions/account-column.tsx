"use client";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import React from "react";

type AccountColumnProps = {
  account: string;
  accountId: string;
};

export const AccountColumn: React.FC<AccountColumnProps> = ({
  account,
  accountId,
}) => {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  );
};
