import { DashboardCard } from "@/components/dashboard/card";
import { HomeContent } from "@/components/home/home-content";
import { AuthUser } from "@/lib/schema/auth";
import { decodeB64 } from "@/lib/utils";
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

  const fetchTransaction = await fetch(
    `http://localhost:1323/v1/transaction?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: "Bearer " + authUser()?.accessToken,
      },
      cache: "no-store",
    }
  );

  const transactionJSON = await fetchTransaction.json();

  const transactionOverviewFetch = await fetch(
    "http://localhost:1323/v1/transaction/overview",
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
        <h3 className="text-slate-700">Last Login Time:</h3>
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
