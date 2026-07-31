import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { to: "/admin", key: "admin.dashboard", exact: true },
  { to: "/admin/products", key: "admin.products", exact: false },
  { to: "/admin/offers", key: "admin.offers", exact: false },
  { to: "/admin/discounts", key: "admin.discounts", exact: false },
  { to: "/admin/delivery", key: "admin.delivery", exact: false },
  { to: "/admin/contacts", key: "admin.contact", exact: false },
  { to: "/admin/email", key: "admin.email.title", exact: false },
  { to: "/admin/settings", key: "admin.settings", exact: false },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-base font-normal tracking-[0.18em] text-foreground sm:text-lg">
            {t("admin.title")}
          </h1>
          <Link
            to="/"
            className="text-sm font-semibold tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
          >
            {t("admin.backToSite")}
          </Link>
        </div>
        <nav className="border-t border-border/60">
          <ul className="mx-auto flex max-w-5xl items-center gap-5 overflow-x-auto px-5 py-3 sm:justify-center sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ADMIN_NAV.map((item) => (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  className="text-sm font-normal tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: item.exact }}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/25 bg-card p-6 shadow-[0_1px_24px_-18px_oklch(0.218_0_0/0.6)] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: ReactNode }) {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-[0.08em] text-foreground sm:text-3xl">
        {children}
      </h2>
      <span className="mt-4 block h-px w-10 bg-primary/60" aria-hidden="true" />
    </>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-normal text-foreground transition-colors focus:border-primary focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-normal tracking-[0.08em] text-muted-foreground";

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-[5rem]", props.className)} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(inputClass, "cursor-pointer appearance-none", props.className)}
    />
  );
}

export function AdminButton({
  children,
  variant = "primary",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-lg px-5 py-3 text-sm font-normal tracking-[0.14em] transition-all duration-300 disabled:opacity-50",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "border border-border text-muted-foreground hover:text-foreground",
        props.className,
      )}
    >
      {children}
    </button>
  );
}
