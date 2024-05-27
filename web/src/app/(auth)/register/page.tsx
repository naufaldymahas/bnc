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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { encodeB64 } from "@/lib/utils";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/shared";

export default function Register() {
  const cookies = useCookies();
  const router = useRouter();
  const { toast } = useToast();
  const [countryCode, setCountryCode] = useState<string>("+62");
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
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
      values.userPhoneNumber = countryCode + values.userPhoneNumber;
      const responseFetch = await fetch(BASE_URL_API + "/v1/auth/register", {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await responseFetch.json();

      if (!responseFetch.ok) {
        toast({
          title: "Error Register",
          description: response.errorMessage,
          variant: "destructive",
        });

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
    }
  };

  const requestOTP = async () => {
    const email = form.getValues().userEmail;
    setLoadingSendOTP(true);
    if (email) {
      try {
        const responseFetch = await fetch(BASE_URL_API + "/v1/auth/otp/send", {
          body: JSON.stringify({ email }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await responseFetch.json();

        if (responseFetch.ok) {
          toast({
            title: "Success Send OTP",
          });
          return;
        }

        toast({
          title: "Error Send OTP",
          description: response.errorMessage,
          variant: "destructive",
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log(JSON.stringify(error));
        }
      } finally {
        setLoadingSendOTP(false);
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
                  <div className="flex">
                    <Select
                      defaultValue={countryCode}
                      onValueChange={(e) => setCountryCode(e)}
                    >
                      <SelectTrigger className="w-1/4">
                        <SelectValue
                          defaultValue={countryCode}
                          placeholder="+62"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+60">+60</SelectItem>
                        <SelectItem value="+61">+61</SelectItem>
                        <SelectItem value="+62">+62</SelectItem>
                        <SelectItem value="+63">+63</SelectItem>
                        <SelectItem value="+64">+64</SelectItem>
                        <SelectItem value="+65">+65</SelectItem>
                        <SelectItem value="+66">+66</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="ml-2"
                      placeholder="Phone No."
                      {...field}
                    />
                  </div>
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
                      disabled={!form.getValues().userEmail || loadingSendOTP}
                    >
                      Send OTP Code
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant={"yellow"}
            className="mb-3 w-full"
            type="submit"
            disabled={!form.formState.isValid || form.formState.isLoading}
          >
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
