import { DashboardCard } from "@/components/dashboard/card";
import { HomeContent } from "@/components/home/home-content";
import { AuthUser, UserRole } from "@/lib/schema/auth";
import { TransactionStatus } from "@/lib/schema/transaction";
import { BASE_URL_API } from "@/lib/shared";
import { decodeB64 } from "@/lib/utils";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { useCallback } from "react";

interface HomeProps {
  params: Record<string, any>;
  searchParams: Record<string, any>;
}

export default async function Home(props: HomeProps) {
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

  const urlTransaction = new URL(BASE_URL_API + "/v1/transaction");
  urlTransaction.searchParams.set("page", page);
  urlTransaction.searchParams.set("limit", limit);
  if (authUser()?.user.role === UserRole.Maker) {
    urlTransaction.searchParams.set(
      "fromAccountNumber",
      authUser()?.user.corporateAccountNumber!
    );
  } else {
    urlTransaction.searchParams.set(
      "status",
      TransactionStatus.awaiting_approval
    );
  }

  const fetchTransaction = await fetch(urlTransaction.href, {
    headers: {
      Authorization: "Bearer " + authUser()?.accessToken,
    },
    cache: "no-store",
  });

  const transactionJSON = await fetchTransaction.json();

  const transactionOverviewFetch = await fetch(
    BASE_URL_API+"/v1/transaction/overview",
    {
      headers: {
        Authorization: "Bearer " + authUser()?.accessToken,
      },
      cache: "no-store",
    }
  );
  const transactionOverview = await transactionOverviewFetch.json();

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-slate-700">Last Login Time: {format(authUser()?.lastLoginAt!, 'dd LLL, yyyy HH:mm:ss')}</h3>
      </DashboardCard>
      <DashboardCard>
        <HomeContent
          datas={transactionJSON.data}
          totalData={transactionJSON.totalData}
          userRole={authUser()?.user?.role}
          overviewData={transactionOverview.data}
        />
      </DashboardCard>
    </>
  );
}
