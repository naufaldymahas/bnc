import { DashboardCard } from "@/components/dashboard/card";
import { TransactionContent } from "@/components/transaction/transaction-content";
import { AuthUser } from "@/lib/schema/auth";
import { TTransaction } from "@/lib/schema/transaction";
import { decodeB64 } from "@/lib/utils";
import { cookies } from "next/headers";
import { useCallback } from "react";

interface TransactionProps {
  params: Record<string, any>;
  searchParams: Record<string, any>;
}

export default async function Transaction(props: TransactionProps) {
  const page = props.searchParams?.page ?? 1;
  const limit = props.searchParams?.limit ?? 10;

  const authUser = useCallback(() => {
    const authUserBase64 = cookies().get("auth");
    if (authUserBase64) {
      const authUserString = decodeB64(authUserBase64.value);

      return JSON.parse(authUserString) as AuthUser;
    }

    return null;
  }, []);

  const transactionUrl = new URL("http://localhost:1323/v1/transaction");
  transactionUrl.searchParams.set("page", page);
  transactionUrl.searchParams.set("limit", limit);

  const transactionResponseFetch = await fetch(transactionUrl.href, {
    headers: {
      Authorization: "Bearer " + authUser()?.accessToken,
    },
    cache: "no-cache",
  });

  const transactionResponse: { data: TTransaction[]; totalData: number } =
    await transactionResponseFetch.json();

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-lg font-semibold">Transaction List</h3>
      </DashboardCard>
      <DashboardCard>
        <TransactionContent
          datas={transactionResponse.data}
          totalData={transactionResponse.totalData}
        />
      </DashboardCard>
    </>
  );
}
