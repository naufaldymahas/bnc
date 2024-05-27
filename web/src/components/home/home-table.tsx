"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/schema/auth";
import { TTransaction, TransactionStatus } from "@/lib/schema/transaction";
import { formatRupiah } from "@/lib/utils";
import { BanIcon, CircleCheck, ClipboardListIcon, EyeIcon } from "lucide-react";
import { TransactionDetail } from "../transaction-detail";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { TransactionConfirmation } from "../transaction-confirmation";
import { BASE_URL_API } from "@/lib/shared";

interface HomeTableProps {
  userRole?: UserRole;
  page: string;
  limit: string;
  confirmHandler: Function;
  transactions: {
    data: TTransaction[];
    totalData: number;
  };
  setTransactions: Function;
  activeTransaction?: TTransaction;
  setActiveTransaction: Function;
  action: TransactionStatus;
  setAction: Function;
  openConfirmation: boolean;
  setOpenConfirmation: Function;
  isLoadingAuditTransaction: boolean;
  fromAccountNumber?: string;
}

export function HomeTable({
  userRole,
  page,
  limit,
  transactions,
  activeTransaction,
  confirmHandler,
  setActiveTransaction,
  setAction,
  setOpenConfirmation,
  isLoadingAuditTransaction,
  action,
  openConfirmation,
  setTransactions,
  fromAccountNumber,
}: HomeTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useAuthContext();
  const [openDetail, setOpenDetail] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const openDetailHandler = async (transaction: TTransaction) => {
    let searchParam = `/?page=${page}&limit=${limit}`;
    if (fromAccountNumber) {
      searchParam += "&fromAccountNumber=" + fromAccountNumber;
    }

    router.replace(`${searchParam}&pageDetail=1&limitDetail=10`);
    setActiveTransaction(transaction);

    setOpenDetail(true);
  };

  const closeDetailHandler = async (e: boolean) => {
    let searchParam = `/?page=${page}&limit=${limit}`;
    if (fromAccountNumber) {
      searchParam += "&fromAccountNumber=" + fromAccountNumber;
    }
    router.replace(searchParam);
    setOpenDetail(e);
  };

  const openConfirmationHandler = (
    operation: TransactionStatus,
    data: TTransaction
  ) => {
    setAction(operation);
    setOpenConfirmation(true);
    setActiveTransaction(data);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const totalPage = useMemo(() => {
    if (transactions.totalData) {
      return Math.ceil(transactions.totalData / parseInt(limit));
    }

    return 1;
  }, [transactions, limit]);

  const limitHandler = (val: string) => {
    let searchParam = `/?page=${page}&limit=${val}`;
    if (fromAccountNumber) {
      searchParam += "&fromAccountNumber=" + fromAccountNumber;
    }
    router.replace(searchParam);
  };

  const fetchTransaction = async () => {
    const transactionUrl = new URL(`${BASE_URL_API}/v1/transaction`);
    transactionUrl.searchParams.set("page", page);
    transactionUrl.searchParams.set("limit", limit);
    transactionUrl.searchParams.set(
      "status",
      TransactionStatus.awaiting_approval
    );
    if (fromAccountNumber) {
      transactionUrl.searchParams.set("fromAccountNumber", fromAccountNumber);
    }

    const transactionResponseFetch = await fetch(transactionUrl.href, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      cache: "no-store",
    });

    const transactionResponse = await transactionResponseFetch.json();

    setTransactions({
      data: transactionResponse.data,
      totalData: transactionResponse.totalData,
    });
  };

  useEffect(() => {
    if (!isLoaded) {
      fetchTransaction();
    }

    setIsLoaded(false);
  }, [searchParams]);

  return (
    <>
      <div className="overflow-auto mt-5">
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Reference No.</TableHead>
              <TableHead>Total Transfer Amount(Rp)</TableHead>
              <TableHead>Total Transfer Record</TableHead>
              <TableHead>From Account No.</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>Transfer Date</TableHead>
              <TableHead>Operation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-56">
                  <div className="text-slate-600">
                    <ClipboardListIcon className="mx-auto" size={100} />
                    <p>No Data</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.data.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.id}</TableCell>
                  <TableCell>
                    Rp{formatRupiah(data.totalTransferAmount)}
                  </TableCell>
                  <TableCell>{data.totalTransferRecord}</TableCell>
                  <TableCell>{data.fromAccountNumber}</TableCell>
                  <TableCell>{data.makerName}</TableCell>
                  <TableCell>
                    {format(data.transferDate, "dd LLL, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex text-yellow-500">
                      {userRole === UserRole.Approver && (
                        <>
                          <button
                            className="mr-3 flex items-center hover:text-yellow-400"
                            disabled={isLoadingAuditTransaction}
                            onClick={() =>
                              openConfirmationHandler(
                                TransactionStatus.approved,
                                data
                              )
                            }
                          >
                            <CircleCheck size={16} className="mr-1" />
                            <span>Approve</span>
                          </button>
                          <button
                            className="mr-3 flex items-center hover:text-yellow-400"
                            disabled={isLoadingAuditTransaction}
                            onClick={() =>
                              openConfirmationHandler(
                                TransactionStatus.rejected,
                                data
                              )
                            }
                          >
                            <BanIcon size={16} className="mr-1" />
                            <span>Reject</span>
                          </button>
                          <TransactionConfirmation
                            open={openConfirmation}
                            setOpen={setOpenConfirmation}
                            action={action}
                            transaction={activeTransaction}
                            confirmHandler={confirmHandler}
                          />
                        </>
                      )}
                      <button
                        className="flex items-center hover:text-yellow-400"
                        onClick={() => openDetailHandler(data)}
                      >
                        <EyeIcon size={16} className="mr-1" />
                        <span>Detail</span>
                      </button>
                      <TransactionDetail
                        open={openDetail}
                        setOpen={closeDetailHandler}
                        accessToken={accessToken}
                        transaction={activeTransaction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {transactions.totalData && (
        <div className="mt-3 flex justify-between">
          <Pagination>
            <PaginationContent>
              {parseInt(page) !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      "?" +
                      createQueryString("page", (parseInt(page) - 1).toString())
                    }
                  />
                </PaginationItem>
              )}

              {parseInt(page) > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {parseInt(page) === 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href={"?" + createQueryString("page", "1")}
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
                            "page",
                            (parseInt(page) + 1).toString()
                          )
                        }
                      >
                        {(parseInt(page) + 1).toString()}
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
              {parseInt(page) > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href={
                        "?" +
                        createQueryString(
                          "page",
                          (parseInt(page) - 1).toString()
                        )
                      }
                    >
                      {(parseInt(page) - 1).toString()}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      href={"?" + createQueryString("page", page)}
                    >
                      {page.toString()}
                    </PaginationLink>
                  </PaginationItem>
                  {totalPage > parseInt(page) && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href={
                            "?" +
                            createQueryString(
                              "page",
                              (parseInt(page) + 1).toString()
                            )
                          }
                        >
                          {(parseInt(page) + 1).toString()}
                        </PaginationLink>
                      </PaginationItem>
                      {parseInt(page) < totalPage - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                </>
              )}
              {parseInt(page) < totalPage - 1 && (
                <PaginationItem>
                  <PaginationLink
                    href={"?" + createQueryString("page", totalPage.toString())}
                  >
                    {totalPage.toString()}
                  </PaginationLink>
                </PaginationItem>
              )}
              {totalPage !== parseInt(page) && (
                <PaginationItem>
                  <PaginationNext
                    href={
                      "?" +
                      createQueryString("page", (parseInt(page) + 1).toString())
                    }
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          <div className="flex w-1/2 justify-end gap-2 items-center">
            <span>Total {transactions.totalData} items</span>
            <Select value={limit} onValueChange={(e) => limitHandler(e)}>
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
    </>
  );
}
