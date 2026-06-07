/**
 * Shared TypeScript types consumed by both apps/server and apps/web.
 * @context  Phase 1 placeholder — both apps need to agree on API response shapes.
 *           Published as dist/*.d.ts so NodeNext (server) and Bundler (web) module
 *           resolution can both consume it without cross-config friction.
 * @gotchas  ApiResponse<T> does not use a discriminated union — data and error can
 *           both be non-null simultaneously. Strengthen before writing consumers.
 */
export type ApiResponse<T> = {
  data: T;
  error: string | null;
};
