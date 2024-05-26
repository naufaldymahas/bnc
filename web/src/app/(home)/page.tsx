import { DashboardCard } from "@/components/dashboard/card";
import { HomeTable } from "@/components/home-table";
import { TransactionCard } from "@/components/home/transaction-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthUser } from "@/lib/schema/auth";
import { decodeB64 } from "@/lib/utils";
import { cookies } from "next/headers";
import { useCallback } from "react";

interface HomeProps {
  params: Record<string, any>;
  searchParams: Record<string, any>;
}

export default async function Home(props: HomeProps) {
  console.log(props);

  const authUser = useCallback(() => {
    const authUserBase64 = cookies().get("auth");

    if (authUserBase64) {
      const authUserString = decodeB64(authUserBase64.value);

      return JSON.parse(authUserString) as AuthUser;
    }

    return null;
  }, []);

  const page = props.searchParams?.page ?? 1;
  const limit = props.searchParams?.limit ?? 10;

  const fetchTransaction = await fetch(
    `http://localhost:1323/v1/transaction?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: "Bearer " + authUser()?.accessToken,
      },
    }
  );

  const transactionJSON = await fetchTransaction.json();
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
        <HomeTable
          isLoaded={true}
          datas={transactionJSON?.data ?? []}
          userRole={authUser()?.user?.role}
        />
      </DashboardCard>
    </>
  );
}
