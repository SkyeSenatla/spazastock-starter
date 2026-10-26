import {ApiError} from "@api/client";

export function ErrorView({error}: {error: unknown}) {
  if (error instanceof ApiError) {
    if (err.status ===429)
    return err.retryAfter 
      ? 'Too many requests. Please try again in ${err.retryAfter} seconds.'
        : 'Too many requests. Please try again later.';
      
  } 