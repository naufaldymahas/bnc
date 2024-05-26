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
import { TransactionDetail } from "./transaction-detail";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { TransactionConfirmation } from "./transaction-confirmation";
import { useToast } from "./ui/use-toast";

interface HomeTableProps {
  datas: TTransaction[];
  userRole?: UserRole;
  totalData: number;
}

export function HomeTable({ datas, userRole, totalData }: HomeTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthContext();
  const [openDetail, setOpenDetail] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<TTransaction>();
  const [action, setAction] = useState(TransactionStatus.approved);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [transactions, setTransactions] = useState({
    data: datas,
    totalData,
  });
  const [isLoadingAuditTransaction, setIsLoadingAuditTransaction] =
    useState(false);

  const page = useMemo(() => searchParams.get("page") ?? 1, [searchParams]);
  const limit = useMemo(() => searchParams.get("limit") ?? 1, [searchParams]);

  const openDetailHandler = async (transaction: TTransaction) => {
    router.replace(`/?page=${page}&limit=${limit}&pageDetail=1&limitDetail=10`);
    setActiveTransaction(transaction);

    setOpenDetail(true);
  };

  const closeDetailHandler = async (e: boolean) => {
    router.replace(`/?page=${page}&limit=${limit}`);
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

  const submitAuditTransaction = async () => {
    setIsLoadingAuditTransaction(true);
    try {
      const responseAuditFetch = await fetch(
        "http://localhost:1323/v1/transaction/audit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            isApproved: action === TransactionStatus.approved,
            transactionId: activeTransaction?.id,
          }),
        }
      );

      const responseAudit = await responseAuditFetch.json();

      if (!responseAuditFetch.ok) {
        toast({
          title: responseAudit.errorMessage,
          variant: "destructive",
        });
      } else {
        const responseTransactionFetch = await fetch(
          `http://localhost:1323/v1/transaction?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        const responseTransaction = await responseTransactionFetch.json();

        if (!responseTransactionFetch.ok) {
          toast({
            title: responseTransaction.errorMessage,
            variant: "destructive",
          });

          return;
        }

        setTransactions({
          data: responseTransaction.data,
          totalData: responseTransaction.totalData,
        });
        const act =
          action === TransactionStatus.approved ? "Approve" : "Reject";
        toast({
          title: `Success ${act} Reference No.:${activeTransaction?.id}`,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingAuditTransaction(false);
      setActiveTransaction(undefined);
      setOpenConfirmation(false);
    }
  };

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
                            confirmHandler={submitAuditTransaction}
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

      <div className="mt-3 flex justify-between">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex w-1/5 justify-end gap-2 items-center">
          <span>Total {transactions.totalData} items</span>
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
    </>
  );
}
