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
import { insertTransactionSchema } from "@/db/schema";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useGetSingleTransaction } from "../api/use-get-single-transaction";
import { TransactionForm } from "./transaction-form";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction();
  const transactionQuery = useGetSingleTransaction(id);

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction!"
  );

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const isPending =
    editMutation.isPending ||
    transactionQuery.isLoading ||
    deleteMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.data.accountId,
        categoryId: transactionQuery.data.data.categoryId,
        amount: transactionQuery.data.data.amount.toString(),
        date: transactionQuery.data.data.date
          ? new Date(transactionQuery.data.data.date)
          : new Date(),
        payee: transactionQuery.data.data.payee,
        notes: transactionQuery.data.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
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
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit existing transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute flex items-center justify-center inset-0">
              <Loader className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
