"use client";

import {
  TTransaction,
  TTransactionOverview,
  TransactionStatus,
} from "@/lib/schema/transaction";
import { TransactionOverview } from "../transaction-overview";
import { HomeTable } from "./home-table";
import { UserRole } from "@/lib/schema/auth";
import { useMemo, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSearchParams } from "next/navigation";

interface HomeContentProps {
  datas: TTransaction[];
  userRole?: UserRole;
  totalData: number;
  overviewData: TTransactionOverview;
}

export function HomeContent({
  datas,
  totalData,
  userRole,
  overviewData,
}: HomeContentProps) {
  const { accessToken, user } = useAuthContext();
  const [isLoadingAuditTransaction, setIsLoadingAuditTransaction] =
    useState(false);

  const { toast } = useToast();
  const [transactions, setTransactions] = useState({
    data: datas,
    totalData,
  });
  const searchParams = useSearchParams();
  const [activeTransaction, setActiveTransaction] = useState<TTransaction>();
  const [action, setAction] = useState(TransactionStatus.approved);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const page = useMemo(() => searchParams.get("page") ?? "1", [searchParams]);
  const limit = useMemo(
    () => searchParams.get("limit") ?? "10",
    [searchParams]
  );
  const [overview, setOverview] = useState(overviewData);

  const submitAuditTransaction = async () => {
    setIsLoadingAuditTransaction(true);
    try {
      const responseAuditFetch = await fetch(
        "http://localhost:1323/v1/transaction/audit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            isApproved: action === TransactionStatus.approved,
            transactionId: activeTransaction?.id,
          }),
        }
      );

      const responseAudit = await responseAuditFetch.json();

      if (!responseAuditFetch.ok) {
        toast({
          title: responseAudit.errorMessage,
          variant: "destructive",
        });
      } else {
        const transactionUrl = new URL(`http://localhost:1323/v1/transaction`);
        transactionUrl.searchParams.set("page", page);
        transactionUrl.searchParams.set("limit", limit);
        if (user.role === UserRole.Maker) {
          transactionUrl.searchParams.set(
            "fromAccountNumber",
            user.corporateAccountNumber
          );
        }

        const [responseTransactionFetch, responseTransactionOverviewFetch] =
          await Promise.all([
            fetch(transactionUrl.href, {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }),
            fetch("http://localhost:1323/v1/transaction/overview", {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }),
          ]);

        const responseTransaction = await responseTransactionFetch.json();
        const responseTransactionOverview =
          await responseTransactionOverviewFetch.json();

        if (!responseTransactionFetch.ok) {
          toast({
            title: responseTransaction.errorMessage,
            variant: "destructive",
          });

          return;
        }

        setOverview(responseTransactionOverview);
        setTransactions({
          data: responseTransaction.data,
          totalData: responseTransaction.totalData,
        });
        const act =
          action === TransactionStatus.approved ? "Approve" : "Reject";
        toast({
          title: `Success ${act} Reference No.:${activeTransaction?.id}`,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingAuditTransaction(false);
      setActiveTransaction(undefined);
      setOpenConfirmation(false);
    }
  };

  return (
    <>
      <TransactionOverview overview={overview} />
      <HomeTable
        userRole={userRole}
        action={action}
        setAction={setAction}
        activeTransaction={activeTransaction}
        setActiveTransaction={setActiveTransaction}
        confirmHandler={submitAuditTransaction}
        isLoadingAuditTransaction={isLoadingAuditTransaction}
        limit={limit}
        page={page}
        openConfirmation={openConfirmation}
        setOpenConfirmation={setOpenConfirmation}
        transactions={transactions}
        setTransactions={setTransactions}
        fromAccountNumber={
          user.role === UserRole.Maker ? user.corporateAccountNumber : undefined
        }
      />
    </>
  );
}
