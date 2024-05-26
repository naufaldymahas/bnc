import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  TTransactionDetail,
  TransactionStatus,
} from "@/lib/schema/transaction";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface TransactionDetailProps {
  open: boolean;
  setOpen: Function;
  fromAccountNumber: string;
  maker: string;
  createdAt: string;
  referenceNumber: string;
  transferDate: string;
  instructionType: string;
  totalRecord: number;
  totalAmount: number;
  datas?: TTransactionDetail[];
  totalData?: number;
}

export function TransactionDetail({
  open,
  setOpen,
  createdAt,
  fromAccountNumber,
  instructionType,
  maker,
  referenceNumber,
  totalAmount,
  totalRecord,
  transferDate,
  datas,
  totalData,
}: TransactionDetailProps) {
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  console.log(createQueryString("pageDetail", "1"));
  return (
    <Dialog onOpenChange={(val) => setOpen(val)} open={open}>
      <DialogContent className="max-w-[1000px]">
        <div className="p-5 bg-zinc-100 mt-5">
          <div className="flex gap-10">
            <div>
              <p className="text-zinc-600">
                From Account No.:{" "}
                <span className="text-black font-semibold">
                  {fromAccountNumber}
                </span>
              </p>
              <p className="text-zinc-600">
                Submit Date and Time:{" "}
                <span className="text-black font-semibold">
                  {format(createdAt, "dd LLL, yyyy HH:mm:SS")}
                </span>
              </p>
              <p className="text-zinc-600">
                Transfer Date:{" "}
                <span className="text-black font-semibold">
                  {format(transferDate, "dd LLL, yyyy")}
                </span>
              </p>
              <p className="text-zinc-600 capitalize">
                Instruction Type:{" "}
                <span className="text-black font-semibold">
                  {instructionType}
                </span>
              </p>
            </div>
            <div>
              <p className="text-zinc-600">
                Maker: <span className="text-black font-semibold">{maker}</span>
              </p>
              <p className="text-zinc-600">
                Reference No.:{" "}
                <span className="text-black font-semibold">
                  {referenceNumber}
                </span>
              </p>
              <p className="text-zinc-600">
                Transfer Type:{" "}
                <span className="text-black font-semibold">Online</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <span className="mr-2">
            Total Transfer Record: <b>{totalRecord}</b>
          </span>
          <span className="mr-2">
            Total Amount: <b>Rp{formatRupiah(totalAmount)}</b>
          </span>
          <span>
            Estimated Service Fee: <b>Rp{formatRupiah(0)}</b>
          </span>
        </div>

        <div className="overflow-auto mt-5">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead>To Account No.</TableHead>
                <TableHead>To Account Name</TableHead>
                <TableHead>To Account Bank</TableHead>
                <TableHead>Transfer Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas &&
                datas.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.toAccountNumber}</TableCell>
                    <TableCell>{data.toAccountName}</TableCell>
                    <TableCell>{data.toAccountBank}</TableCell>
                    <TableCell>{data.transferAmount}</TableCell>
                    <TableCell>
                      {data.status === TransactionStatus.awaiting_approval
                        ? "Awaiting approval"
                        : data.status === TransactionStatus.approved
                        ? "Approved"
                        : "Rejected"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {totalData && (
          <div className="mt-3 flex justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    isActive
                    href={"?" + createQueryString("pageDetail", "1")}
                  />
                </PaginationItem>
                {new Array(Math.ceil(totalData / 10)).fill(1).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={i === 0}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex w-1/2 justify-end gap-2 items-center">
              <span>Total {totalData} items</span>
              <Select>
                <SelectTrigger className="w-1/3">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {["10", "15", "30", "50", "100"].map((p) => (
                      <SelectItem value={p} key={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
