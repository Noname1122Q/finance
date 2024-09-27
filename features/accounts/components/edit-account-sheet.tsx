import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useGetSingleAccount } from "@/features/accounts/api/use-get-single-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";
import { insertAccountSchema } from "@/db/schema";

const formSchema = insertAccountSchema.pick({
  name: true,
});
type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount();
  const accountQuery = useGetSingleAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account!"
  );

  const isLoading = accountQuery.isLoading;
  const isPending = editMutation.isPending || deleteMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.data.name,
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Make changes to your saved account.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute flex items-center justify-center inset-0">
              <Loader className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
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
