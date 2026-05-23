import { describe, it, expect } from "vitest";
import {
  calculateDiscount,
  formatPrice,
  getDeliveryCharge,
  isValidIndianPhone,
  isValidPincode
} from "@/utils/helpers";

describe("Price formatting", () => {
  it("formats price with ₹ and Indian locale", () => {
    expect(formatPrice(4199)).toBe("₹4,199");
    expect(formatPrice(100000)).toBe("₹1,00,000");
  });
});

describe("Discount calculation", () => {
  it("calculates correct discount percentage", () => {
    expect(calculateDiscount(4199, 6500)).toBe(35);
  });

  it("returns 0 if price equals MRP", () => {
    expect(calculateDiscount(999, 999)).toBe(0);
  });

  it("returns 0 if MRP is 0", () => {
    expect(calculateDiscount(499, 0)).toBe(0);
  });
});

describe("Indian phone validation", () => {
  it("accepts valid Indian mobile numbers", () => {
    expect(isValidIndianPhone("9876543210")).toBe(true);
    expect(isValidIndianPhone("6789012345")).toBe(true);
  });

  it("rejects numbers not starting with 6-9", () => {
    expect(isValidIndianPhone("1234567890")).toBe(false);
  });

  it("rejects numbers with wrong length", () => {
    expect(isValidIndianPhone("98765432")).toBe(false);
  });
});

describe("Pincode validation", () => {
  it("accepts valid 6-digit pincode", () => {
    expect(isValidPincode("560034")).toBe(true);
  });

  it("rejects non-numeric pincode", () => {
    expect(isValidPincode("56003A")).toBe(false);
  });

  it("rejects pincode with wrong length", () => {
    expect(isValidPincode("56003")).toBe(false);
  });
});

describe("Delivery charge logic", () => {
  it("gives free delivery above ₹999", () => {
    expect(getDeliveryCharge(999)).toBe(0);
    expect(getDeliveryCharge(1500)).toBe(0);
  });

  it("charges ₹49 below ₹999", () => {
    expect(getDeliveryCharge(499)).toBe(49);
  });
});
