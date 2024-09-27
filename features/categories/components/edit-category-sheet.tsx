import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useConfirm } from "@/hooks/use-confirm";
import { insertCategorySchema } from "@/db/schema";
import { useOpenCategory } from "../hooks/use-open-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useGetSingleCategory } from "../api/use-get-single-category";
import { CategoryForm } from "./category-form";

const formSchema = insertCategorySchema.pick({
  name: true,
});
type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory();
  const categoryQuery = useGetSingleCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category!"
  );

  const isLoading = categoryQuery.isLoading;
  const isPending = editMutation.isPending || deleteMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.data.name,
      }
    : {
        name: "",
      };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Make changes to your saved Category.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute flex items-center justify-center inset-0">
              <Loader className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
