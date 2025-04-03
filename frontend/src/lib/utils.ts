import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleCopy(orderId: string | number) {
  navigator.clipboard.writeText(String(orderId));
  toast.success("Order ID copied to clipboard");
}

