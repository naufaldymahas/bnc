import { DashboardCard } from "@/components/dashboard/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthUser } from "@/lib/schema/auth";
import { TTransaction, TransactionStatus } from "@/lib/schema/transaction";
import { cn, decodeB64, formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import { DotIcon, EyeIcon } from "lucide-react";
import { cookies } from "next/headers";
import { useCallback } from "react";

export default async function Transaction() {
  const authUser = useCallback(() => {
    const authUserBase64 = cookies().get("auth");
    if (authUserBase64) {
      const authUserString = decodeB64(authUserBase64.value);

      return JSON.parse(authUserString) as AuthUser;
    }

    return null;
  }, []);

  const transactionResponseFetch = await fetch(
    "http://localhost:1323/v1/transaction",
    {
      headers: {
        Authorization: "Bearer " + authUser()?.accessToken,
      },
    }
  );

  const transactionResponse: { data: TTransaction[] } =
    await transactionResponseFetch.json();

  console.log(transactionResponse);

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-lg font-semibold">Transaction List</h3>
      </DashboardCard>
      <DashboardCard>
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
              {transactionResponse.data.map((transaction) => (
                <TableRow id={transaction.id}>
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
      </DashboardCard>
    </>
  );
}
