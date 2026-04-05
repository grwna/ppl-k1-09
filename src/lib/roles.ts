
export const ROLES = {
  ADMIN: "ADMIN",
  DONOR: "DONOR",
  BORROWER: "BORROWER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
