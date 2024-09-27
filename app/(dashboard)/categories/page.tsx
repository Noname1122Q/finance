"use client";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/app/(dashboard)/categories/columns";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

const CategoriesPage = () => {
  const newCategory = useNewCategory();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];
  const deleteCategories = useBulkDeleteCategories();

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1 ">Categories</CardTitle>
          <Button onClick={newCategory.onOpen} size={"sm"}>
            <Plus /> Add new
          </Button>
        </CardHeader>
      </Card>
      <DataTable
        filterKey="name"
        columns={columns}
        data={categories}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          deleteCategories.mutate({ ids });
        }}
        disabled={isDisabled}
      />
    </div>
  );
};

export default CategoriesPage;
