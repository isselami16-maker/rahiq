import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminCard,
  AdminSectionTitle,
  AdminField,
  AdminInput,
  AdminButton,
} from "@/components/admin/AdminLayout";
import { useI18n } from "@/lib/i18n";
import { useAdmin, type AdminOffer, type DiscountInfo } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/discounts")({
  head: () => ({ meta: [{ title: "Discounts — Admin" }] }),
  component: AdminDiscountsPage,
});

function AdminDiscountsPage() {
  const { t } = useI18n();
  const { state, updateOffer } = useAdmin();
  const [editing, setEditing] = useState<{ offerId: string; discount: DiscountInfo } | null>(null);

  if (state.offers.length === 0) {
    return (
      <AdminLayout>
        <AdminSectionTitle>{t("admin.discounts")}</AdminSectionTitle>
        <p className="mt-10 text-center text-sm font-light text-muted-foreground">
          {t("admin.discounts.noOffers")}
        </p>
      </AdminLayout>
    );
  }

  function startEdit(offer: AdminOffer) {
    setEditing({
      offerId: offer.id,
      discount: { ...(offer.discount ?? { enabled: false, oldPrice: offer.price, newPrice: offer.price, startDate: "", endDate: "" }) },
    });
  }

  function save() {
    if (!editing) return;
    updateOffer(editing.offerId, { discount: editing.discount });
    setEditing(null);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.discounts")}</AdminSectionTitle>

      <div className="mt-8 space-y-4">
        {state.offers.map((offer) => {
          const discount = offer.discount;
          const isActive = discount?.enabled;
          const pct = discount && discount.oldPrice > 0
            ? Math.round(((discount.oldPrice - discount.newPrice) / discount.oldPrice) * 100)
            : 0;

          return (
            <AdminCard key={offer.id}>
              <div className="flex items-center gap-4">
                {offer.images[0] && (
                  <img src={offer.images[0]} alt="" className="h-16 w-16 rounded-md object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-light text-foreground">{offer.name.ar} / {offer.name.en}</p>
                  <p className="mt-1 text-[0.62rem] font-light tracking-[0.14em] text-muted-foreground">
                    {isActive
                      ? `${t("admin.discounts.active")} · -${pct}% · ${discount!.newPrice} DA`
                      : t("admin.discounts.inactive")}
                  </p>
                </div>
                <AdminButton variant="ghost" onClick={() => startEdit(offer)}>
                  {t("admin.products.edit")}
                </AdminButton>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {editing && (
        <AdminCard className="mt-6">
          <div className="space-y-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editing.discount.enabled}
                onChange={(e) => setEditing({ ...editing, discount: { ...editing.discount, enabled: e.target.checked } })}
                className="h-4 w-4 accent-[oklch(0.769_0.127_87.6)]"
              />
              <span className="text-[0.72rem] font-light tracking-[0.14em] text-foreground">
                {t("admin.discounts.enable")}
              </span>
            </label>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.discounts.oldPrice")}>
                <AdminInput
                  type="number"
                  value={editing.discount.oldPrice}
                  onChange={(e) => setEditing({ ...editing, discount: { ...editing.discount, oldPrice: Number(e.target.value) } })}
                />
              </AdminField>
              <AdminField label={t("admin.discounts.newPrice")}>
                <AdminInput
                  type="number"
                  value={editing.discount.newPrice}
                  onChange={(e) => setEditing({ ...editing, discount: { ...editing.discount, newPrice: Number(e.target.value) } })}
                />
              </AdminField>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.discounts.startDate")}>
                <AdminInput
                  type="date"
                  value={editing.discount.startDate}
                  onChange={(e) => setEditing({ ...editing, discount: { ...editing.discount, startDate: e.target.value } })}
                />
              </AdminField>
              <AdminField label={t("admin.discounts.endDate")}>
                <AdminInput
                  type="date"
                  value={editing.discount.endDate}
                  onChange={(e) => setEditing({ ...editing, discount: { ...editing.discount, endDate: e.target.value } })}
                />
              </AdminField>
            </div>
            {editing.discount.oldPrice > 0 && (
              <p className="text-[0.62rem] font-light tracking-[0.14em] text-muted-foreground">
                {t("admin.discounts.percentage")}:{" "}
                {Math.round(((editing.discount.oldPrice - editing.discount.newPrice) / editing.discount.oldPrice) * 100)}%
              </p>
            )}
            <div className="flex gap-3">
              <AdminButton onClick={save}>{t("admin.discounts.save")}</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>
                {t("admin.products.cancel")}
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}
