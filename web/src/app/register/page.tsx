import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export interface RegisterProps {}

export default function Register(props: RegisterProps) {
  return (
    <div className="container h-screen">
      <div className="flex flex-col justify-center mx-auto h-full md:w-1/3">
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="corporateAccountNo">Corporate Account No.</Label>
          <Input id="corporateAccountNo" placeholder="Corporate Account No." />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="corporateName">Corporate Name</Label>
          <Input id="corporateName" placeholder="Corporate Name" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="userId">User ID</Label>
          <Input id="userId" placeholder="User ID" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="userName">User Name</Label>
          <Input id="userName" placeholder="User Name" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="Role" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="phoneNo">Phone No.</Label>
          <Input id="phoneNo" placeholder="Phone No." />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Password" />
        </div>
        <div className="grid w-full items-center gap-1.5 mb-3">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input id="verificationCode" placeholder="Verification Code" />
        </div>
        <Button variant={"yellow"} className="mb-3" disabled={true}>
          Submit
        </Button>
        <p>
          Already have an account?{" "}
          <Link
            className="text-yellow-500 hover:text-yellow-400/90"
            href={"/login"}
          >
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
