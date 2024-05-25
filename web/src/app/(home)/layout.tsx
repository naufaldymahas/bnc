import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, HomeIcon, Monitor } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="w-1/4 bg-bncblue min-h-screen">
        <div className="text-[3rem] text-white text-center mb-6">
          B<span className="text-yellow-500">N</span>C
        </div>
        <div className="text-white text-md flex w-full bg-yellow-500 px-6 py-3 cursor-pointer">
          <HomeIcon className="mr-3" />
          Home
        </div>
        <div className="text-white text-md flex w-full px-6 py-3 cursor-pointer hover:bg-blue-950">
          <Monitor className="mr-3" />
          Fund Transfer
        </div>
        <div className="text-white text-md flex w-full px-6 py-3 cursor-pointer hover:bg-blue-950">
          <FileText className="mr-3" />
          Transaction List
        </div>
      </div>
      <div className="w-full bg-bncgray">
        <div className="p-3">
          <div className="flex justify-end pb-3">
            <div className="pr-6 flex items-center">
              <Avatar className="h-[1.5rem] w-[1.5rem] mr-1">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>[USER ID]</span>
            </div>
            <button>Log Out</button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}