import createClient from "@api/client";
import { process } from "node_modules/zod/v4/core/to-json-schema";

export const apiClient = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});


export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly retryAfter?: number,
    errors?: string

    constructor(status: number, body: number, errors?: string
        this.status = status;
        this.retryAfter = body;
        this.errors = errors;

  )
  }
  