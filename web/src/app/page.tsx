"use client";

import { DashboardCard } from "@/components/dashboard/card";
import { InputFile } from "@/components/dashboard/input-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from "lucide-react";

export default function Home() {
  const asdsd = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0]);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-bncblue min-h-screen">kiri</div>
      <div className="w-full bg-bncgray">
        <div className="p-3">
          <div className="flex justify-end">
            <div>profile kanan</div>
          </div>
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
                <InputFile className="w-full py-10" onChange={asdsd} />
              </div>
              <button className="my-3 flex">
                <Download className="mr-2 text-yellow-500" />
                <span className="text-yellow-500">Download Template</span>
              </button>
              <div className="mt-6">
                <p className="mb-3">*Instruction Type</p>
                <RadioGroup defaultValue="comfortable" className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label className="text-zinc-400 font-normal" htmlFor="r1">
                      Immediate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label className="text-zinc-400 font-normal" htmlFor="r2">
                      Standing Instruction
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-6">
                <p>*Total Transfer Record</p>
                <Input placeholder="Please Input" />
              </div>
              <div className="my-6">
                <p>Transfer Amount</p>
                <Input placeholder="Please Input Amount" />
              </div>
              <Button variant="yellow">Next</Button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
