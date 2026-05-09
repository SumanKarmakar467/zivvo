export const isEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const minLength = (val, len) => (val || "").length >= len;
