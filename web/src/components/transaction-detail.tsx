import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn, formatRupiah } from "@/lib/utils";
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
  TTransaction,
  TTransactionDetail,
  TransactionStatus,
} from "@/lib/schema/transaction";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "./ui/use-toast";
import { DotIcon } from "lucide-react";

interface TransactionDetailProps {
  open: boolean;
  setOpen: Function;
  transaction?: TTransaction;
  accessToken: string;
}

export function TransactionDetail({
  open,
  setOpen,
  transaction,
  accessToken,
}: TransactionDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const [transactionDetail, setTransactionDetail] = useState<
    | {
        data: TTransactionDetail[];
        totalData: number;
      }
    | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (transaction?.id && !isLoading) {
      const page = searchParams.get("pageDetail");
      const limit = searchParams.get("limitDetail");
      const url = new URL(
        `http://localhost:1323/v1/transaction/${transaction.id}`
      );
      url.searchParams.set("page", page ?? "1");
      url.searchParams.set("limit", limit ?? "10");
      const responseFetch = await fetch(url.href, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      const response = await responseFetch.json();
      if (!responseFetch.ok) {
        toast({
          title: response.errorMessage,
          variant: "destructive",
        });
        return;
      }

      setTransactionDetail({
        data: response.data,
        totalData: response.totalData,
      });
    }
    setIsLoading(false);
  }, [searchParams, transaction, isLoading]);

  useEffect(() => {
    fetchDetail();
  }, [searchParams, transaction]);

  const page = searchParams.get("pageDetail")
    ? parseInt(searchParams.get("pageDetail")!)
    : 1;

  const limit = searchParams.get("limitDetail")
    ? parseInt(searchParams.get("limitDetail")!)
    : 10;

  const limitHandler = (val: string) => {
    const pageTransaction = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;

    const limitTransaction = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 1;

    router.push(
      `/?page=${pageTransaction}&limit=${limitTransaction}&pageDetail=${page}&limitDetail=${val}`
    );
  };

  const totalPage = useMemo(() => {
    if (transactionDetail?.totalData) {
      return Math.ceil(transactionDetail.totalData / limit);
    }

    return 1;
  }, [transactionDetail, limit]);

  return (
    <Dialog onOpenChange={(val) => setOpen(val)} open={open}>
      <DialogContent className="max-w-[1000px]">
        <div className="p-5 bg-zinc-100 mt-5">
          <div className="flex gap-10">
            <div>
              <p className="text-zinc-600">
                From Account No.:{" "}
                <span className="text-black font-semibold">
                  {transaction?.fromAccountNumber}
                </span>
              </p>
              <p className="text-zinc-600">
                Submit Date and Time:{" "}
                <span className="text-black font-semibold">
                  {format(
                    transaction?.createdAt ?? new Date(),
                    "dd LLL, yyyy HH:mm:SS"
                  )}
                </span>
              </p>
              <p className="text-zinc-600">
                Transfer Date:{" "}
                <span className="text-black font-semibold">
                  {format(
                    transaction?.transferDate ?? new Date(),
                    "dd LLL, yyyy"
                  )}
                </span>
              </p>
              <p className="text-zinc-600 capitalize">
                Instruction Type:{" "}
                <span className="text-black font-semibold">
                  {transaction?.instructionType}
                </span>
              </p>
            </div>
            <div>
              <p className="text-zinc-600">
                Maker:{" "}
                <span className="text-black font-semibold">
                  {transaction?.makerName}
                </span>
              </p>
              <p className="text-zinc-600">
                Reference No.:{" "}
                <span className="text-black font-semibold">
                  {transaction?.id}
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
            Total Transfer Record: <b>{transaction?.totalTransferRecord}</b>
          </span>
          <span className="mr-2">
            Total Amount:{" "}
            <b>Rp{formatRupiah(transaction?.totalTransferAmount ?? 0)}</b>
          </span>
          <span>
            Estimated Service Fee: <b>Rp{formatRupiah(0)}</b>
          </span>
        </div>

        <div className="overflow-auto mt-5 h-96">
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
              {transactionDetail?.data &&
                transactionDetail?.data.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.toAccountNumber}</TableCell>
                    <TableCell>{data.toAccountName}</TableCell>
                    <TableCell>{data.toAccountBank}</TableCell>
                    <TableCell>{data.transferAmount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DotIcon
                          className={cn(
                            data.status === TransactionStatus.approved
                              ? "text-green-500"
                              : "",
                            data.status === TransactionStatus.rejected
                              ? "text-red-500"
                              : ""
                          )}
                        />
                        <span>
                          {data.status === TransactionStatus.awaiting_approval
                            ? "Awaiting approval"
                            : data.status === TransactionStatus.approved
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {transactionDetail?.totalData && (
          <div className="mt-3 flex justify-between">
            <Pagination>
              <PaginationContent>
                {page !== 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        "?" +
                        createQueryString("pageDetail", (page - 1).toString())
                      }
                    />
                  </PaginationItem>
                )}

                {page > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {page === 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href={"?" + createQueryString("pageDetail", "1")}
                        isActive
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {totalPage >= 2 && (
                      <PaginationItem>
                        <PaginationLink
                          href={
                            "?" +
                            createQueryString(
                              "pageDetail",
                              (page + 1).toString()
                            )
                          }
                        >
                          {(page + 1).toString()}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {totalPage > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                {page > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href={
                          "?" +
                          createQueryString("pageDetail", (page - 1).toString())
                        }
                      >
                        {(page - 1).toString()}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        isActive
                        href={
                          "?" + createQueryString("pageDetail", page.toString())
                        }
                      >
                        {page.toString()}
                      </PaginationLink>
                    </PaginationItem>
                    {totalPage > page && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            href={
                              "?" +
                              createQueryString(
                                "pageDetail",
                                (page + 1).toString()
                              )
                            }
                          >
                            {(page + 1).toString()}
                          </PaginationLink>
                        </PaginationItem>
                        {page < totalPage - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}
                  </>
                )}
                {page < totalPage - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href={
                        "?" +
                        createQueryString("pageDetail", totalPage.toString())
                      }
                    >
                      {totalPage.toString()}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {totalPage !== page && (
                  <PaginationItem>
                    <PaginationNext
                      href={
                        "?" +
                        createQueryString("pageDetail", (page + 1).toString())
                      }
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>

            <div className="flex w-1/2 justify-end gap-2 items-center">
              <span>Total {transactionDetail?.totalData} items</span>
              <Select
                value={limit.toString()}
                onValueChange={(e) => limitHandler(e)}
              >
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
