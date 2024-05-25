import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface TransactionCardProps {
  variant: "awaiting_approval" | "approved" | "rejected";
  value: number;
}

export const TransactionCard = ({ variant, value }: TransactionCardProps) => {
  const title = useMemo(() => {
    switch (variant) {
      case "awaiting_approval":
        return "Awaiting approval";
      case "approved":
        return "Successfully";
      default:
        return "Rejected";
    }
  }, []);

  return (
    <div className="shadow-md bg-stone-200 px-5 py-6 rounded-lg">
      <p className="text-stone-500 mb-5">{title}</p>
      <p
        className={cn(
          "text-6xl font-semibold",
          variant === "awaiting_approval" ? "text-orange-300" : "",
          variant === "approved" ? "text-green-300" : "",
          variant === "rejected" ? "text-red-300" : ""
        )}
      >
        {value}
      </p>
    </div>
  );
};
