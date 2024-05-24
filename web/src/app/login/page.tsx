"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface LoginProps {}

export default function Login(props: LoginProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
  };

  console.log(errors);
  console.log(isValid);

  return (
    <div className="container h-screen">
      <div className="flex flex-col justify-center mx-auto h-full md:w-1/3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="corporateAccountNumber">
              Corporate Account No.
            </Label>
            <Input
              id="corporateAccountNumber"
              placeholder="Corporate Account No."
              {...register("corporateAccountNumber")}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" placeholder="User ID" {...register("userId")} />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="password">Login Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Login Password"
              {...register("password")}
            />
          </div>
          <Button
            className="mb-3 w-full"
            type="submit"
            variant="yellow"
            disabled={!isValid}
          >
            Login
          </Button>
        </form>

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
