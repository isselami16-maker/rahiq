import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminCard,
  AdminSectionTitle,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
} from "@/components/admin/AdminLayout";
import { useI18n } from "@/lib/i18n";
import { useAdmin, type AdminOffer } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/offers")({
  head: () => ({ meta: [{ title: "Offers — Admin" }] }),
  component: AdminOffersPage,
});

function emptyOffer(): AdminOffer {
  return {
    id: "",
    name: { ar: "", en: "" },
    description: { ar: "", en: "" },
    longDescription: { ar: "", en: "" },
    images: [""],
    price: 0,
    maxQuantity: 99,
    freeDelivery: false,
    includes: [],
    perfumes: [],
    discount: {
      enabled: false,
      oldPrice: 0,
      newPrice: 0,
      startDate: "",
      endDate: "",
    },
  };
}

function AdminOffersPage() {
  const { t } = useI18n();
  const { state, addOffer, updateOffer, deleteOffer } = useAdmin();
  const [editing, setEditing] = useState<AdminOffer | null>(null);

  function startEdit(o: AdminOffer) {
    setEditing({ ...o, images: [...o.images], includes: [...o.includes] });
  }

  function startAdd() {
    setEditing(emptyOffer());
  }

  function save() {
    if (!editing) return;
    const id = editing.id || `offer-${Date.now()}`;
    const offer = { ...editing, id };
    if (editing.id) {
      updateOffer(editing.id, offer);
    } else {
      addOffer(offer);
    }
    setEditing(null);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.offers")}</AdminSectionTitle>
      <div className="mt-8">
        <AdminButton onClick={startAdd}>{t("admin.offers.add")}</AdminButton>
      </div>

      {editing && (
        <AdminCard className="mt-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.offers.nameAr")}>
                <AdminInput
                  value={editing.name.ar}
                  onChange={(e) => setEditing({ ...editing, name: { ...editing.name, ar: e.target.value } })}
                />
              </AdminField>
              <AdminField label={t("admin.offers.nameEn")}>
                <AdminInput
                  value={editing.name.en}
                  onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })}
                />
              </AdminField>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.offers.descAr")}>
                <AdminTextarea
                  value={editing.description.ar}
                  onChange={(e) => setEditing({ ...editing, description: { ...editing.description, ar: e.target.value } })}
                />
              </AdminField>
              <AdminField label={t("admin.offers.descEn")}>
                <AdminTextarea
                  value={editing.description.en}
                  onChange={(e) => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })}
                />
              </AdminField>
            </div>
            <AdminField label={t("admin.offers.images")}>
              <AdminInput
                value={editing.images.join(", ")}
                onChange={(e) => setEditing({ ...editing, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="https://..., https://..."
              />
            </AdminField>
            <AdminField label={t("admin.offers.price")}>
              <AdminInput
                type="number"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
            </AdminField>
            <AdminField label={t("admin.offers.maxQuantity")}>
              <AdminInput
                type="number"
                value={editing.maxQuantity ?? 99}
                onChange={(e) => setEditing({ ...editing, maxQuantity: Number(e.target.value) })}
              />
            </AdminField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.offers.longDescAr")}>
                <AdminTextarea
                  value={editing.longDescription?.ar ?? ""}
                  onChange={(e) => setEditing({ ...editing, longDescription: { ...editing.longDescription!, ar: e.target.value } })}
                />
              </AdminField>
              <AdminField label={t("admin.offers.longDescEn")}>
                <AdminTextarea
                  value={editing.longDescription?.en ?? ""}
                  onChange={(e) => setEditing({ ...editing, longDescription: { ...editing.longDescription!, en: e.target.value } })}
                />
              </AdminField>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editing.freeDelivery}
                onChange={(e) => setEditing({ ...editing, freeDelivery: e.target.checked })}
                className="h-4 w-4 accent-[oklch(0.769_0.127_87.6)]"
              />
              <span className="text-sm font-normal tracking-[0.08em] text-foreground">
                {t("admin.offers.freeDelivery")}
              </span>
            </label>
            <div className="flex gap-3">
              <AdminButton onClick={save}>{t("admin.offers.save")}</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>
                {t("admin.offers.cancel")}
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      <div className="mt-8 space-y-4">
        {state.offers.map((o) => (
          <AdminCard key={o.id}>
            <div className="flex items-center gap-4">
              {o.images[0] && (
                <img src={o.images[0]} alt="" className="h-16 w-16 rounded-md object-cover" />
              )}
              <div className="flex-1">
                <p className="text-base font-normal text-foreground">{o.name.ar} / {o.name.en}</p>
                <p className="mt-1 text-sm font-normal tracking-[0.08em] text-muted-foreground">
                  {o.price} DA {o.freeDelivery ? "· Free Delivery" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => startEdit(o)}>
                  {t("admin.offers.edit")}
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  onClick={() => {
                    if (confirm(t("admin.offers.confirmDelete"))) deleteOffer(o.id);
                  }}
                >
                  {t("admin.offers.delete")}
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminLayout>
  );
}
