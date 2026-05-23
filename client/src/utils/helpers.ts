export function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function calculateDiscount(price: number, mrp: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function getDeliveryCharge(subtotal: number): number {
  return subtotal >= 999 ? 0 : 49;
}
