"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      corporateAccountNumber: "",
      password: "",
      userId: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const responseFetch = await fetch("http://localhost:1323/v1/auth/login", {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await responseFetch.json();

      if (!responseFetch.ok) {
        setErrorMessage(response.errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(JSON.stringify(error));
      }
    }
  };

  return (
    <div className="container">
      <div className="flex flex-col justify-center mx-auto min-h-screen md:w-1/3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="corporateAccountNumber"
              render={({ field }) => (
                <FormItem className="mb-6">
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
              name="userId"
              render={({ field }) => (
                <FormItem className="mb-6">
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
              name="password"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Login Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Login Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <div className="mb-3 text-red-600">{errorMessage}</div>
            )}

            <Button
              className="mb-3 w-full"
              type="submit"
              variant="yellow"
              disabled={!form.formState.isValid}
            >
              Login
            </Button>
          </form>
        </Form>

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
