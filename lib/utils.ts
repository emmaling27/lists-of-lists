import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nameString = (t: string) =>
  z
    .string()
    .min(2, { message: `${t} must be at least two characters.` })
    .max(50, { message: `${t} must be less than 50 characters.` });
