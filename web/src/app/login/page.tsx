import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export interface LoginProps {}

export default function Login(props: LoginProps) {
  return (
    <div className="container h-screen">
      <div className="flex flex-col justify-center mx-auto h-full md:w-1/3">
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="corporateAccountNo">Corporate Account No.</Label>
          <Input id="corporateAccountNo" placeholder="Corporate Account No." />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="userId">User ID</Label>
          <Input id="userId" placeholder="User ID" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="password">Login Password</Label>
          <Input type="password" id="password" placeholder="Login Password" />
        </div>
        <Button variant={"yellow"} className="mb-3">
          Login
        </Button>
        <p>
          Don't have an account?{" "}
          <Link
            className="text-yellow-500 hover:text-yellow-400/90"
            href={"/register"}
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
