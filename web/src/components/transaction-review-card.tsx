import { cn, formatRupiah } from "@/lib/utils";

interface TransactionReviewCardProps {
  totalRecord: number;
  totalAmount: number;
  fromAccountNumber: string;
  instructionType: string;
  referenceNumber?: string;
  className?: string;
}

export function TransactionReviewCard(props: TransactionReviewCardProps) {
  return (
    <div className={cn("p-5 bg-zinc-100", props.className)}>
      <div className="mb-3">
        <span className="text-zinc-500">Total Transfer Record: </span>
        <span className="ml-2 font-semibold">{props.totalRecord}</span>
      </div>
      <div className="mb-3">
        <span className="text-zinc-500">Total Transfer Amount:</span>
        <span className="ml-2 font-semibold">
          Rp{formatRupiah(props.totalAmount)}
        </span>
      </div>
      <hr />
      <div className="my-3">
        <span className="text-zinc-500">From Account No.:</span>
        <span className="ml-2 font-semibold">{props.fromAccountNumber}</span>
      </div>
      <div className={cn(props.referenceNumber ? "mb-3" : "")}>
        <span className="text-zinc-500">Instruction Type:</span>
        <span className="ml-2 font-semibold capitalize">
          {props.instructionType}
        </span>
      </div>
      {props.referenceNumber && (
        <>
          <div className="mb-3">
            <span className="text-zinc-500">Transfer Type:</span>
            <span className="ml-2 font-semibold">Online</span>
          </div>
          <div>
            <span className="text-zinc-500">Reference No.:</span>
            <span className="ml-2 font-semibold">{props.referenceNumber}</span>
          </div>
        </>
      )}
    </div>
  );
}
