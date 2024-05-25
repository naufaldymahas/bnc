import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encodeB64 = (val: string) =>
  Buffer.from(val, "binary").toString("base64");
export const decodeB64 = (val: string) =>
  Buffer.from(val, "base64").toString("binary");
