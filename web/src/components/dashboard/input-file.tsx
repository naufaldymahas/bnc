import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { ChangeEventHandler, useRef } from "react";

interface InputFileProps {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const InputFile = ({ className, onChange }: InputFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={onChange}
      />
      <button
        onClick={onChooseFile}
        className={cn(
          "bg-zinc-100 border-dashed border-2 rounded-xl p-6 text-center",
          className
        )}
      >
        <Inbox size={50} className="mx-auto mb-5 text-yellow-500" />
        <h3 className="text-lg font-bold">Choose Your Template</h3>
        <p>Only csv format is support</p>
      </button>
    </>
  );
};
