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
import {
  CalendarIcon,
  Download,
  FileText,
  HomeIcon,
  LinkIcon,
  Monitor,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Transfer() {
  const [date, setDate] = useState<Date>();
  const [showDateTime, setShowDateTime] = useState(false);
  const [choosenFile, setChoosenFile] = useState<any>();

  const uploadFile = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0]);
      setChoosenFile(event.target.files[0]);
    }
  };

  return (
    <>
      <DashboardCard className="mb-3">
        <h3 className="text-lg font-semibold">Create Transaction</h3>
      </DashboardCard>
      <DashboardCard>
        <div className="mt-1 mb-5">
          <h2 className="text-center text-xl font-semibold">
            Please enter transfer information
          </h2>
        </div>
        <hr className="mb-3" />
        <div className="px-96">
          <div>
            <InputFile className="w-full py-10" onChange={uploadFile} />
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
          <div className="mt-6">
            <Label>
              <span className="text-red-500">*</span>Instruction Type
            </Label>
            <RadioGroup defaultValue="comfortable" className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label className="text-slate-500 font-normal" htmlFor="r1">
                  Immediate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
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
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="est">
                        Eastern Standard Time (EST)
                      </SelectItem>
                      <SelectItem value="cst">
                        Central Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="mst">
                        Mountain Standard Time (MST)
                      </SelectItem>
                      <SelectItem value="pst">
                        Pacific Standard Time (PST)
                      </SelectItem>
                      <SelectItem value="akst">
                        Alaska Standard Time (AKST)
                      </SelectItem>
                      <SelectItem value="hst">
                        Hawaii Standard Time (HST)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Europe & Africa</SelectLabel>
                      <SelectItem value="gmt">
                        Greenwich Mean Time (GMT)
                      </SelectItem>
                      <SelectItem value="cet">
                        Central European Time (CET)
                      </SelectItem>
                      <SelectItem value="eet">
                        Eastern European Time (EET)
                      </SelectItem>
                      <SelectItem value="west">
                        Western European Summer Time (WEST)
                      </SelectItem>
                      <SelectItem value="cat">
                        Central Africa Time (CAT)
                      </SelectItem>
                      <SelectItem value="eat">
                        East Africa Time (EAT)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Asia</SelectLabel>
                      <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                      <SelectItem value="ist">
                        India Standard Time (IST)
                      </SelectItem>
                      <SelectItem value="cst_china">
                        China Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="jst">
                        Japan Standard Time (JST)
                      </SelectItem>
                      <SelectItem value="kst">
                        Korea Standard Time (KST)
                      </SelectItem>
                      <SelectItem value="ist_indonesia">
                        Indonesia Central Standard Time (WITA)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Australia & Pacific</SelectLabel>
                      <SelectItem value="awst">
                        Australian Western Standard Time (AWST)
                      </SelectItem>
                      <SelectItem value="acst">
                        Australian Central Standard Time (ACST)
                      </SelectItem>
                      <SelectItem value="aest">
                        Australian Eastern Standard Time (AEST)
                      </SelectItem>
                      <SelectItem value="nzst">
                        New Zealand Standard Time (NZST)
                      </SelectItem>
                      <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>South America</SelectLabel>
                      <SelectItem value="art">Argentina Time (ART)</SelectItem>
                      <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                      <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                      <SelectItem value="clt">
                        Chile Standard Time (CLT)
                      </SelectItem>
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
            <Input placeholder="Please Input" id="totalTransferRecord" />
          </div>
          <div className="my-6">
            <Label htmlFor="transferAmount">
              <span className="text-red-500">*</span>Transfer Amount
            </Label>
            <Input placeholder="Please Input Amount" id="transferAmount" />
          </div>
          <Button variant="yellow">Next</Button>
        </div>
      </DashboardCard>
    </>
  );
}
