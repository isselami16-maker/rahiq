import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminCard, AdminSectionTitle } from "@/components/admin/AdminLayout";
import { useI18n } from "@/lib/i18n";
import { useAdmin, selectDiscountedOffers } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — RAHIQ Parfums" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { t } = useI18n();
  const { state } = useAdmin();
  const discountedCount = selectDiscountedOffers(state.offers).length;

  const stats = [
    { label: t("admin.products"), value: state.products.length },
    { label: t("admin.offers"), value: state.offers.length },
    { label: t("admin.discounts"), value: discountedCount },
  ];

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.dashboard")}</AdminSectionTitle>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <AdminCard key={s.label}>
            <p className="text-[0.62rem] font-light tracking-[0.2em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-3 text-3xl font-extralight tabular-nums text-foreground">
              {s.value}
            </p>
          </AdminCard>
        ))}
      </div>
    </AdminLayout>
  );
}
