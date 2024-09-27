"use client";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import React from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type CategoryColumnProps = {
  category: string | null;
  categoryId: string | null;
  id: string;
};

export const CategoryColumn: React.FC<CategoryColumnProps> = ({
  id,
  category,
  categoryId,
}) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!categoryId && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Uncatogorised"}
    </div>
  );
};
