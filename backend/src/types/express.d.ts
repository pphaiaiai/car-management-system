export {};

declare global {
  namespace Express {
    interface Locals {
      validated: {
        params?: unknown;
        query?: unknown;
        body?: unknown;
      };
    }
  }
}
