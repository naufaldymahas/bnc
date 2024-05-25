"use client";

import { DashboardCard } from "@/components/dashboard/card";
import { TransactionCard } from "@/components/home/transaction-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BanIcon, CircleCheck, EyeIcon } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const invoices = useMemo(
    () => [
      {
        id: "INV001",
        totalTransferRecord: "Paid",
        totalAmount: "$250.00",
        fromAccountNo: "Credit Card",
        maker: "Credit Card",
        transferDate: "Credit Card",
      },
      {
        id: "INV002",
        totalTransferRecord: "Pending",
        totalAmount: "$150.00",
        fromAccountNo: "PayPal",
        maker: "PayPal",
        transferDate: "PayPal",
      },
      {
        id: "INV003",
        totalTransferRecord: "Unpaid",
        totalAmount: "$350.00",
        fromAccountNo: "Bank Transfer",
        maker: "Bank Transfer",
        transferDate: "Bank Transfer",
      },
      {
        id: "INV004",
        totalTransferRecord: "Paid",
        totalAmount: "$450.00",
        fromAccountNo: "Credit Card",
        maker: "Credit Card",
        transferDate: "Credit Card",
      },
      {
        id: "INV005",
        totalTransferRecord: "Paid",
        totalAmount: "$550.00",
        fromAccountNo: "PayPal",
        maker: "PayPal",
        transferDate: "PayPal",
      },
      {
        id: "INV006",
        totalTransferRecord: "Pending",
        totalAmount: "$200.00",
        fromAccountNo: "Bank Transfer",
        maker: "Bank Transfer",
        transferDate: "Bank Transfer",
      },
      {
        id: "INV007",
        totalTransferRecord: "Unpaid",
        totalAmount: "$300.00",
        fromAccountNo: "Credit Card",
        maker: "Credit Card",
        transferDate: "Credit Card",
      },
    ],
    []
  );

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-slate-700">Last Login Time:</h3>
      </DashboardCard>
      <DashboardCard>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-3">
              <TransactionCard value={0} variant="awaiting_approval" />
              <TransactionCard value={0} variant="approved" />
              <TransactionCard value={0} variant="rejected" />
            </div>
          </CardContent>
        </Card>

        <Table className="mt-5">
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
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalTransferRecord}</TableCell>
                <TableCell>{invoice.fromAccountNo}</TableCell>
                <TableCell>{invoice.maker}</TableCell>
                <TableCell>{invoice.transferDate}</TableCell>
                <TableCell>
                  <div className="flex text-yellow-500">
                    <button className="mr-3 flex items-center hover:text-yellow-400">
                      <CircleCheck size={16} className="mr-1" />
                      <span>Approve</span>
                    </button>
                    <button className="mr-3 flex items-center hover:text-yellow-400">
                      <BanIcon size={16} className="mr-1" />
                      <span>Reject</span>
                    </button>
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
      </DashboardCard>
    </>
  );
}
