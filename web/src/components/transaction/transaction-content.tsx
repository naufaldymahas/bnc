"use client";

import { cn, formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { addDays, format } from "date-fns";
import { CalendarIcon, DotIcon, EyeIcon } from "lucide-react";
import { TTransaction, TransactionStatus } from "@/lib/schema/transaction";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionDetail } from "../transaction-detail";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";

interface TransactionContentProps {
  datas: TTransaction[];
  totalData: number;
}

export function TransactionContent({
  datas,
  totalData,
}: TransactionContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthContext();
  const [transactions, seTransactions] = useState({
    data: datas,
    totalData,
  });
  const [activeTransaction, setActiveTransaction] = useState<TTransaction>();
  const [openDetail, setOpenDetail] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus>();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [fromAccountNumber, setFromAccountNumber] = useState("");

  const openDetailHandler = (transaction: TTransaction) => {
    setActiveTransaction(transaction);
    setOpenDetail(true);
  };

  const closeOpenDetailHandler = (e: boolean) => {
    setOpenDetail(e);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const page = useMemo(
    () => (searchParams.get("page") ? searchParams.get("page")! : "1"),
    [searchParams]
  );
  const limit = useMemo(
    () => (searchParams.get("limit") ? searchParams.get("limit")! : "10"),
    [searchParams]
  );
  const totalPage = useMemo(() => {
    if (transactions.totalData) {
      return Math.ceil(transactions.totalData / parseInt(limit));
    }

    return 1;
  }, [transactions, limit]);

  const limitHandler = (val: string) => {
    let searchParam = `/transaction?page=${page}&limit=${val}`;
    router.replace(searchParam);
  };

  const fetchTransaction = async () => {
    const transactionUrl = new URL("http://localhost:1323/v1/transaction");
    transactionUrl.searchParams.set("page", page);
    transactionUrl.searchParams.set("limit", limit);

    if (selectedStatus) {
      transactionUrl.searchParams.set("status", selectedStatus);
    }

    if (date?.from && date?.to) {
      transactionUrl.searchParams.set("startDate", date.from.toISOString());
      transactionUrl.searchParams.set("endDate", date.to.toISOString());
    }

    if (fromAccountNumber) {
      transactionUrl.searchParams.set("fromAccountNumber", fromAccountNumber);
    }

    const transactionResponseFetch = await fetch(transactionUrl.href, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      cache: "no-cache",
    });

    const transactionResponse: { data: TTransaction[]; totalData: number } =
      await transactionResponseFetch.json();

    seTransactions({
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

  const resetState = () => {
    setSelectedStatus(undefined);
    setDate(undefined);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="w-1/5">
          <Label htmlFor="dateFiler">Submit Date and Time</Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateFiler"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="w-1/3">
          <Label htmlFor="fromNumberAccount">From Account No.</Label>
          <Input
            id="fromNumberAccount"
            placeholder="Input Account Number"
            value={fromAccountNumber}
            onChange={(e) => setFromAccountNumber(e.target.value)}
          />
        </div>
        <div className="w-1/6">
          <Label htmlFor="status">Status</Label>
          <Select
            value={selectedStatus}
            onValueChange={(e) =>
              setSelectedStatus(
                TransactionStatus[e as keyof typeof TransactionStatus]
              )
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Please Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TransactionStatus.approved}>
                Approved
              </SelectItem>
              <SelectItem value={TransactionStatus.rejected}>
                Rejected
              </SelectItem>
              <SelectItem value={TransactionStatus.awaiting_approval}>
                Awaiting Approval
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button
          variant="yellow"
          onClick={() => {
            fetchTransaction();
          }}
        >
          Search
        </Button>
        <Button variant="outline" onClick={resetState}>
          Reset
        </Button>
      </div>
      <div className="overflow-auto mt-5">
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Reference No.</TableHead>
              <TableHead>Total Transfer Amount(Rp)</TableHead>
              <TableHead>From Account No.</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Operation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  Rp{formatRupiah(transaction.totalTransferAmount)}
                </TableCell>
                <TableCell>{transaction.fromAccountNumber}</TableCell>
                <TableCell>{transaction.makerName}</TableCell>
                <TableCell>
                  {format(transaction.createdAt, "dd LLL, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DotIcon
                      className={cn(
                        transaction.status === TransactionStatus.approved
                          ? "text-green-500"
                          : "",
                        transaction.status === TransactionStatus.rejected
                          ? "text-red-500"
                          : ""
                      )}
                    />
                    <span>
                      {transaction.status ===
                      TransactionStatus.awaiting_approval
                        ? "Awaiting approval"
                        : transaction.status === TransactionStatus.approved
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex text-yellow-500">
                    <button
                      className="flex items-center hover:text-yellow-400"
                      onClick={() => openDetailHandler(transaction)}
                    >
                      <EyeIcon size={16} className="mr-1" />
                      <span>Detail</span>
                    </button>
                  </div>
                  <TransactionDetail
                    accessToken={accessToken}
                    open={openDetail}
                    setOpen={closeOpenDetailHandler}
                    transaction={activeTransaction}
                    isTransactionPage
                  />
                </TableCell>
              </TableRow>
            ))}
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
    </>
  );
}
