"use client";

import { DashboardCard } from "@/components/dashboard/card";
import { InputFile } from "@/components/dashboard/input-file";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Download, LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { cn, formatRupiah } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function Transfer() {
  const [date, setDate] = useState<Date>();
  const [showDateTime, setShowDateTime] = useState(false);
  const [choosenFile, setChoosenFile] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [totalRecordErrorMessage, setTotalRecordErrorMessage] = useState("");
  const [totalAmountErrorMessage, setTotalAmountErrorMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    actualTotalRecord: 0,
    actualTotalAmount: 0,
    sameAccountNumber: 0,
    status: false,
    isLoaded: false,
  });
  const [loadin, setLoading] = useState(false);
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    return () => {
      setDate(undefined);
      setShowDateTime(false);
      setChoosenFile(undefined);
      setTotalRecord("");
      setTotalAmount("");
      setTotalRecordErrorMessage("");
      setTotalAmountErrorMessage("");
      setUploadStatus({
        actualTotalRecord: 0,
        actualTotalAmount: 0,
        sameAccountNumber: 0,
        status: false,
        isLoaded: false,
      });
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (uploadStatus.isLoaded && uploadStatus.status) {
      const id = setInterval(() => {
        setStep(2);
      }, 1700);
      return () => clearInterval(id);
    }
  }, [uploadStatus]);

  const times = useMemo(
    () => [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ],
    []
  );

  const chooseFileHandler = (event: any) => {
    if (choosenFile) {
      setChoosenFile(undefined);
    }

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setChoosenFile(file);
      // const fd = new FormData();
      // fd.append("file", file);

      // await fetch("http://localhost:1323/v1/transaction/upload", {
      //   method: "POST",
      //   body: fd,
      // });
    }
  };

  const uploadFile = async () => {
    setLoading(true);
    let isValid = true;
    if (totalRecord.search(/^[0-9]+/) === -1) {
      setTotalRecordErrorMessage("Must number only");
      isValid = false;
    }

    if (totalAmount.search(/^[0-9]+/) === -1) {
      setTotalAmountErrorMessage("Must number only");
      isValid = false;
    }

    if (isValid) {
      const fd = new FormData();
      fd.append("file", choosenFile);
      fd.append("totalRecord", totalRecord);
      fd.append("totalAmount", totalAmount);

      try {
        const responseFetch = await fetch(
          "http://localhost:1323/v1/transaction/upload/validation",
          {
            method: "POST",
            body: fd,
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        const response = await responseFetch.json();
        if (!responseFetch.ok) {
          toast({
            title: response?.errorMessage
              ? response.errorMessage
              : response.message,
            variant: "destructive",
          });
          return;
        }

        setUploadStatus({
          status: response.data.status,
          actualTotalRecord: response.data.actualTotalRecord,
          actualTotalAmount: response.data.actualTotalAmount,
          sameAccountNumber: response.data.sameAccountNumber,
          isLoaded: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-lg font-semibold">Create Transaction</h3>
      </DashboardCard>
      <DashboardCard>
        {step === 1 ? (
          <>
            <div className="mt-1 mb-5">
              <h2 className="text-center text-xl font-semibold">
                Please enter transfer information
              </h2>
            </div>
            <hr className="mb-3" />
            <div className="px-96">
              <div>
                <InputFile
                  className="w-full py-10"
                  onChange={chooseFileHandler}
                />
              </div>
              <div className="my-3 flex">
                <Download className="mr-2 text-yellow-500" />
                <a
                  target="_blank"
                  href="http://localhost:1323/v1/transaction/transfer-template"
                >
                  <span className="text-yellow-500">Download Template</span>
                </a>
              </div>
              {choosenFile?.name && (
                <div className="flex items-center text-slate-500">
                  <LinkIcon size={16} />
                  <span className="ml-3">{choosenFile.name}</span>
                </div>
              )}
              {uploadStatus.isLoaded ? (
                !uploadStatus.status ? (
                  <div className="bg-red-100 px-5 py-1 border-2 border-yellow-500 rounded-md mt-5">
                    <span>
                      After detection, there are{" "}
                      <b>{uploadStatus.actualTotalRecord} transfer</b> records,
                      and there is an issue where the same{" "}
                      <b>{uploadStatus.sameAccountNumber}</b> records are
                      associated with the account number, and/or the total
                      transfer record count and/or the total transfer amount do
                      not match. Please kindly check your input and/or reupload
                      your template.
                    </span>
                  </div>
                ) : (
                  <div className="bg-lime-50 px-5 py-1 border-2 border-yellow-500 rounded-md mt-5">
                    <span>
                      After detection, there are{" "}
                      <b>{uploadStatus.actualTotalRecord} transfer</b> records,
                      the total transfer amount is{" "}
                      <b>Rp{formatRupiah(uploadStatus.actualTotalAmount)}</b>.
                    </span>
                  </div>
                )
              ) : undefined}
              <div className="mt-6">
                <Label>
                  <span className="text-red-500">*</span>Instruction Type
                </Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="flex"
                  onValueChange={(e) => setShowDateTime(e === "true")}
                  value={showDateTime ? "true" : "false"}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="r1" />
                    <Label className="text-slate-500 font-normal" htmlFor="r1">
                      Immediate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="r2" />
                    <Label className="text-slate-500 font-normal" htmlFor="r2">
                      Standing Instruction
                    </Label>
                  </div>
                </RadioGroup>
                {showDateTime && (
                  <>
                    <p className="mt-6">
                      <span className="text-red-500">*</span>Instruction Type
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="mt-3">
                      <span className="text-red-500">*</span>Transfer Time
                    </p>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {times.map((t) => (
                            <SelectItem value={t} key={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              <div className="mt-6">
                <Label htmlFor="totalTransferRecord">
                  <span className="text-red-500">*</span>Total Transfer Record
                </Label>
                <Input
                  value={totalRecord}
                  onChange={(e) => setTotalRecord(e.target.value)}
                  placeholder="Please Input"
                  id="totalTransferRecord"
                />
              </div>
              <div className="my-6">
                <Label htmlFor="transferAmount">
                  <span className="text-red-500">*</span>Transfer Amount
                </Label>
                <Input
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="Please Input Amount"
                  id="transferAmount"
                />
              </div>
              <Button
                variant="yellow"
                disabled={!choosenFile || !totalAmount || !totalRecord}
                onClick={uploadFile}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 bg-slate-100">
              <div className="mb-3">
                <span className="text-slate-500">Total Transfer Record: </span>
                <span className="ml-2 font-semibold">
                  {uploadStatus.actualTotalRecord}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-slate-500">Total Transfer Amount:</span>
                <span className="ml-2 font-semibold">
                  Rp{formatRupiah(uploadStatus.actualTotalAmount)}
                </span>
              </div>
              <hr />
              <div className="my-3">
                <span className="text-slate-500">From Account No.:</span>
                <span className="ml-2 font-semibold">
                  {user.corporateAccountNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Instruction Type:</span>
                <span className="ml-2 font-semibold">
                  {!showDateTime ? "Immediate" : ""}
                </span>
              </div>
            </div>
            <div className="mt-5 flex justify-center">
              <Button variant={"yellow"} className="font-bold">
                Confirm
              </Button>
            </div>
          </>
        )}
      </DashboardCard>
    </>
  );
}
