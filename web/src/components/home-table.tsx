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
import { UserRole } from "@/lib/schema/auth";
import { BanIcon, CircleCheck, EyeIcon } from "lucide-react";

interface HomeTableProps {
  datas: Record<string, any>[];
  userRole?: UserRole;
}

export function HomeTable({ datas, userRole }: HomeTableProps) {
  return (
    <>
      <div className="overflow-auto mt-5">
        <Table className="table-fixed w-full">
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
            {datas.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.totalAmount}</TableCell>
                <TableCell>{data.totalTransferRecord}</TableCell>
                <TableCell>{data.fromAccountNo}</TableCell>
                <TableCell>{data.maker}</TableCell>
                <TableCell>{data.transferDate}</TableCell>
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

                    <button className="flex items-center hover:text-yellow-400">
                      <EyeIcon size={16} className="mr-1" />
                      <span>Detail</span>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-3">
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
    </>
  );
}
