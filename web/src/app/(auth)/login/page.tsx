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
import { encodeB64 } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      corporateAccountNumber: "",
      password: "",
      userId: "",
    },
  });
  const cookies = useCookies();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoadingLogin(true);
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
        return;
      }

      const authUserString = encodeB64(JSON.stringify(response.data));
      cookies.set("auth", authUserString, {
        expires: new Date(response.lastLoginAt).getTime(),
      });
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log(JSON.stringify(error));
      }
    } finally {
      setLoadingLogin(false);
    }
  };

  useEffect(() => {
    return () => setLoadingLogin(false);
  }, []);

  return (
    <>
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
            disabled={!form.formState.isValid || loadingLogin}
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
    </>
  );
}
