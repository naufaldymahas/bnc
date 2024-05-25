"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/hooks/useAuthContext";
import { AuthUser } from "@/lib/schema/auth";
import { cn, decodeB64 } from "@/lib/utils";
import { FileText, HomeIcon, Monitor } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useMemo } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const cookies = useCookies();

  if (!cookies.get("auth")) {
    redirect("/login");
  }

  const authUser = useMemo(() => {
    const authUserBase64 = cookies.get("auth");

    const authUserString = decodeB64(authUserBase64!);

    return JSON.parse(authUserString) as AuthUser;
  }, [cookies]);

  const logOutHandler = async () => {
    await fetch("http://localhost:1323/v1/auth/logout", {
      headers: {
        Authorization: "Bearer " + authUser.accessToken,
      },
      method: "POST",
    });

    cookies.remove("auth");
  };

  return (
    <AuthContext.Provider value={authUser}>
      <div className="flex">
        <div className="w-1/4 bg-bncblue min-h-screen">
          <div className="text-[3rem] text-white text-center mb-6">
            B<span className="text-yellow-500">N</span>C
          </div>
          <Link
            href={"/"}
            className={cn(
              "text-white text-md flex w-full px-6 py-3 cursor-pointer",
              pathName === "/" ? "bg-yellow-500" : "hover:bg-blue-950"
            )}
          >
            <HomeIcon className="mr-3" />
            Home
          </Link>
          <Link
            href={"/transfer"}
            className={cn(
              "text-white text-md flex w-full px-6 py-3 cursor-pointer",
              pathName === "/transfer" ? "bg-yellow-500" : "hover:bg-blue-950"
            )}
          >
            <Monitor className="mr-3" />
            Fund Transfer
          </Link>
          <Link
            href={"/transaction"}
            className={cn(
              "text-white text-md flex w-full px-6 py-3 cursor-pointer",
              pathName === "/transaction"
                ? "bg-yellow-500"
                : "hover:bg-blue-950"
            )}
          >
            <FileText className="mr-3" />
            Transaction List
          </Link>
        </div>
        <div className="w-full bg-bncgray">
          <div className="p-3">
            <div className="flex justify-end pb-3">
              <div className="pr-6 flex items-center">
                <Avatar className="h-[1.5rem] w-[1.5rem] mr-1">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{authUser.user.id}</span>
              </div>
              <button onClick={logOutHandler}>Log Out</button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
