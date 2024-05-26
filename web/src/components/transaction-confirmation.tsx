import { TTransaction, TransactionStatus } from "@/lib/schema/transaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface TransactionConfirmationProps {
  open: boolean;
  setOpen: Function;
  transaction?: TTransaction;
  action: TransactionStatus;
  confirmHandler: Function;
}

export function TransactionConfirmation({
  open,
  setOpen,
  action,
  transaction,
  confirmHandler,
}: TransactionConfirmationProps) {
  const actionText = useMemo(() => {
    if (action === TransactionStatus.approved) {
      return "Approve";
    }

    return "Reject";
  }, [action]);

  return (
    <Dialog onOpenChange={(val) => setOpen(val)} open={open}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure want to{" "}
            <b>
              {actionText} Reference No.: {transaction?.id}
            </b>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="yellow"
            onClick={() => confirmHandler()}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
