"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterSchema, UserRole } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      corporateAccountNumber: "",
      corporateName: "",
      otp: "",
      password: "",
      userEmail: "",
      userId: "",
      userName: "",
      userPhoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      await fetch("http://localhost:1323/v1/auth/register", {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const response = await responseFetch.json();
    } catch (error) {
      if (error instanceof Error) {
        console.log(JSON.stringify(error));
      }
    }
  };

  const requestOTP = async () => {
    const email = form.getValues().userEmail;

    try {
      await fetch("http://localhost:1323/v1/auth/otp/send", {
        body: JSON.stringify({ email }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const response = await responseFetch.json();
    } catch (error) {
      if (error instanceof Error) {
        console.log(JSON.stringify(error));
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="corporateAccountNumber"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Corporate Account No.</FormLabel>
                <FormControl>
                  <Input placeholder="Corporate Account No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="corporateName"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Corporate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Corporate Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="User ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="User Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userRole"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.Maker}>Maker</SelectItem>
                    <SelectItem value={UserRole.Approver}>Approver</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userPhoneNumber"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Phone No.</FormLabel>
                <FormControl>
                  <Input placeholder="Phone No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex w-full items-center space-x-2">
                    <Input placeholder="Verification Code" {...field} />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={requestOTP}
                      disabled={!form.getValues().userEmail}
                    >
                      Send OTP Code
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={"yellow"} className="mb-3 w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <p>
        Already have an account?{" "}
        <Link
          className="text-yellow-500 hover:text-yellow-400/90"
          href={"/login"}
        >
          Login Now
        </Link>
      </p>
    </>
  );
}
