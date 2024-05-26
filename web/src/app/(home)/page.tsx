import { DashboardCard } from "@/components/dashboard/card";
import { HomeTable } from "@/components/home-table";
import { TransactionCard } from "@/components/home/transaction-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthUser } from "@/lib/schema/auth";
import { decodeB64 } from "@/lib/utils";
import { cookies } from "next/headers";
import { useCallback, useMemo } from "react";

export default function Home() {
  const authUser = useCallback(() => {
    const authUserBase64 = cookies().get("auth");

    if (authUserBase64) {
      const authUserString = decodeB64(authUserBase64.value);

      return JSON.parse(authUserString) as AuthUser;
    }

    return null;
  }, []);

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
        <HomeTable datas={invoices} userRole={authUser()?.user?.role} />
      </DashboardCard>
    </>
  );
}
