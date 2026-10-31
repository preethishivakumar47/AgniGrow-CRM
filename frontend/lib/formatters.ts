/**
 * Formats numeric values to Indian Rupee standard notation (₹1,25,000)
 */
export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "₹0";
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Generates direct Click-to-WhatsApp link for prospect follow-ups
 */
export function getWhatsAppLink(phone: string, message: string = ""): string {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  // Prepend 91 if it's 10 digits
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Standard date formatting for CRM records
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Human-readable relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(date);
}

