import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard = ({ children, className }: DashboardCardProps) => {
  return (
    <div className={cn("bg-slate-50 p-5 rounded-lg", className)}>
      {children}
    </div>
  );
};
