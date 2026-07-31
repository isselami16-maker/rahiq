import { useAdmin } from "@/lib/admin-store";

const LOCAL_LOGO = "/images/logo/logo.png";

export function BrandLogo({ className = "h-10 w-auto" }: { className?: string }) {
  const { state } = useAdmin();
  const src = state.brand.logoUrl || LOCAL_LOGO;

  return (
    <img
      src={src}
      alt={state.brand.brandName}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}

/**
 * The official brand name. Always rendered exactly as provided, on one line,
 * with a single shared type size for both scripts.
 */
export function BrandName({ className = "" }: { className?: string }) {
  const { state } = useAdmin();

  return (
    <span
      dir="ltr"
      className={`whitespace-nowrap font-bold tracking-[0.1em] text-foreground ${className}`}
    >
      {state.brand.brandName}
    </span>
  );
}
