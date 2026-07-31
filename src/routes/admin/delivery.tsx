import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminCard,
  AdminSectionTitle,
  AdminInput,
  AdminButton,
} from "@/components/admin/AdminLayout";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/lib/admin-store";
import { WILAYAS } from "@/lib/algeria";

export const Route = createFileRoute("/admin/delivery")({
  head: () => ({ meta: [{ title: "Delivery Prices — Admin" }] }),
  component: AdminDeliveryPage,
});

function AdminDeliveryPage() {
  const { t, lang } = useI18n();
  const { state, updateDeliveryPricing } = useAdmin();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.delivery")}</AdminSectionTitle>

      <div className="mt-8 space-y-3">
        {WILAYAS.map((w) => {
          const pricing = state.deliveryPricing[w.code] ?? { home: 0, office: 0, freeDelivery: false };
          return (
            <div
              key={w.code}
              className="flex flex-col gap-3 rounded-md border border-border/70 p-4 sm:flex-row sm:items-center"
            >
              <span className="w-24 shrink-0 text-[0.72rem] font-light tracking-[0.12em] text-muted-foreground">
                {w.code} — {lang === "ar" ? w.nameAr : w.nameEn}
              </span>
              <div className="flex flex-1 flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-[0.62rem] font-light tracking-[0.14em] text-muted-foreground">
                    {t("admin.delivery.home")}
                  </span>
                  <AdminInput
                    type="number"
                    value={pricing.home}
                    onChange={(e) => updateDeliveryPricing(w.code, { home: Number(e.target.value) })}
                    className="w-24"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-[0.62rem] font-light tracking-[0.14em] text-muted-foreground">
                    {t("admin.delivery.office")}
                  </span>
                  <AdminInput
                    type="number"
                    value={pricing.office}
                    onChange={(e) => updateDeliveryPricing(w.code, { office: Number(e.target.value) })}
                    className="w-24"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pricing.freeDelivery}
                    onChange={(e) => updateDeliveryPricing(w.code, { freeDelivery: e.target.checked })}
                    className="h-4 w-4 accent-[oklch(0.769_0.127_87.6)]"
                  />
                  <span className="text-[0.62rem] font-light tracking-[0.14em] text-foreground">
                    {t("admin.delivery.free")}
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <AdminButton onClick={handleSave}>{t("admin.delivery.save")}</AdminButton>
        {saved && (
          <span className="text-[0.62rem] font-light tracking-[0.14em] text-primary">
            {t("admin.delivery.saved")}
          </span>
        )}
      </div>
    </AdminLayout>
  );
}
