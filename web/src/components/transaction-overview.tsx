import { TTransactionOverview } from "@/lib/schema/transaction";
import { TransactionCard } from "./transaction-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TransactionOverviewProps {
  overview: TTransactionOverview;
}

export function TransactionOverview({ overview }: TransactionOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-3">
          <TransactionCard
            value={overview.awaitingApproval}
            variant="awaiting_approval"
          />
          <TransactionCard value={overview.approved} variant="approved" />
          <TransactionCard value={overview.rejected} variant="rejected" />
        </div>
      </CardContent>
    </Card>
  );
}
