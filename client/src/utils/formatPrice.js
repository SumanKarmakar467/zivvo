export const formatPrice = (value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`;
