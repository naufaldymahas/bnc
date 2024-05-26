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
import { TTransaction, TTransactionDetail } from "@/lib/schema/transaction";
import { formatRupiah } from "@/lib/utils";
import { BanIcon, CircleCheck, ClipboardListIcon, EyeIcon } from "lucide-react";
import { TransactionDetail } from "./transaction-detail";
import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";

interface HomeTableProps {
  datas: TTransaction[];
  isLoaded: boolean;
  userRole?: UserRole;
}

export function HomeTable({
  datas,
  userRole,
  isLoaded = false,
}: HomeTableProps) {
  const { accessToken } = useAuthContext();
  const { toast } = useToast();
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<
    | {
        data: TTransactionDetail[];
        totalData: number;
      }
    | undefined
  >();

  const fetchDetail = async (transactionId: string) => {
    setIsLoadingDetail(true);
    try {
      const responseFetch = await fetch(
        `http://localhost:1323/v1/transaction/${transactionId}`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

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

      setOpenDetail(true);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingDetail(false);
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
            {!isLoaded ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-56">
                  <div className="text-slate-600">
                    <ClipboardListIcon className="mx-auto" size={100} />
                    <p>Loading</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : datas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-56">
                  <div className="text-slate-600">
                    <ClipboardListIcon className="mx-auto" size={100} />
                    <p>No Data</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              datas.map((data) => (
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
                          <button className="mr-3 flex items-center hover:text-yellow-400">
                            <CircleCheck size={16} className="mr-1" />
                            <span>Approve</span>
                          </button>
                          <button className="mr-3 flex items-center hover:text-yellow-400">
                            <BanIcon size={16} className="mr-1" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <button
                        className="flex items-center hover:text-yellow-400"
                        onClick={() => fetchDetail(data.id)}
                        disabled={isLoadingDetail}
                      >
                        <EyeIcon size={16} className="mr-1" />
                        <span>Detail</span>
                      </button>
                      <TransactionDetail
                        open={openDetail}
                        setOpen={setOpenDetail}
                        fromAccountNumber={data.fromAccountNumber}
                        maker={data.makerName}
                        instructionType={data.instructionType}
                        transferDate={data.transferDate}
                        createdAt={data.createdAt}
                        referenceNumber={data.id}
                        totalAmount={data.totalTransferAmount}
                        totalRecord={data.totalTransferRecord}
                        datas={transactionDetail?.data}
                        totalData={transactionDetail?.totalData}
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
          <span>Total 8 items</span>
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
