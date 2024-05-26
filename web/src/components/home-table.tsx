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
import { TTransaction } from "@/lib/schema/transaction";
import { formatRupiah } from "@/lib/utils";
import { BanIcon, CircleCheck, ClipboardListIcon, EyeIcon } from "lucide-react";
import { TransactionDetail } from "./transaction-detail";
import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthContext();
  const [openDetail, setOpenDetail] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<TTransaction>();

  const openDetailHandler = async (transaction: TTransaction) => {
    const page = searchParams.get("page") ?? 1;
    const limit = searchParams.get("limit") ?? 10;
    router.replace(`/?page=${page}&limit=${limit}&pageDetail=1&limitDetail=10`);
    setActiveTransaction(transaction);

    setOpenDetail(true);
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
                        onClick={() => openDetailHandler(data)}
                      >
                        <EyeIcon size={16} className="mr-1" />
                        <span>Detail</span>
                      </button>
                      <TransactionDetail
                        open={openDetail}
                        setOpen={(e: boolean) => {
                          const page = searchParams.get("page") ?? 1;
                          const limit = searchParams.get("limit") ?? 10;
                          router.replace(`/?page=${page}&limit=${limit}`);
                          setOpenDetail(e);
                        }}
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
