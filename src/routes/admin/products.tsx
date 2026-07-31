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
import { useAdmin, type Perfume } from "@/lib/admin-store";
import type { BadgeKey } from "@/lib/catalog";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Admin" }] }),
  component: AdminProductsPage,
});

const ALL_BADGES: BadgeKey[] = ["original", "ordinary", "fois2", "fois3"];

function emptyProduct(): Perfume {
  return {
    id: "",
    name: { ar: "", en: "" },
    image: "",
    badges: [],
    ratings: {
      seasons: { spring: 50, summer: 50, autumn: 50, winter: 50 },
      time: { day: 50, night: 50 },
      community: 50,
      reactions: { loved: 50, liked: 50, disliked: 50 },
    },
  };
}

function AdminProductsPage() {
  const { t } = useI18n();
  const { state, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [editing, setEditing] = useState<Perfume | null>(null);

  function startEdit(p: Perfume) {
    setEditing({ ...p });
  }

  function startAdd() {
    setEditing(emptyProduct());
  }

  function save() {
    if (!editing) return;
    const id = editing.id || `perfume-${Date.now()}`;
    const product = { ...editing, id };
    if (editing.id) {
      updateProduct(editing.id, product);
    } else {
      addProduct(product);
    }
    setEditing(null);
  }

  function toggleBadge(badge: BadgeKey) {
    if (!editing) return;
    const has = editing.badges.includes(badge);
    const badges = has
      ? editing.badges.filter((b) => b !== badge)
      : [...editing.badges, badge];
    setEditing({ ...editing, badges });
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.products")}</AdminSectionTitle>
      <div className="mt-8">
        <AdminButton onClick={startAdd}>{t("admin.products.add")}</AdminButton>
      </div>

      {editing && (
        <AdminCard className="mt-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AdminField label={t("admin.products.nameAr")}>
                <AdminInput
                  value={editing.name.ar}
                  onChange={(e) => setEditing({ ...editing, name: { ...editing.name, ar: e.target.value } })}
                />
              </AdminField>
              <AdminField label={t("admin.products.nameEn")}>
                <AdminInput
                  value={editing.name.en}
                  onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })}
                />
              </AdminField>
            </div>
            <AdminField label={t("admin.products.imageUrl")}>
              <AdminInput
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
              />
            </AdminField>
            <AdminField label={t("admin.products.badges")}>
              <div className="flex flex-wrap gap-2">
                {ALL_BADGES.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`rounded-full border px-3 py-1 text-[0.62rem] font-light tracking-[0.14em] transition-colors ${
                      editing.badges.includes(badge)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`badge.${badge}`)}
                  </button>
                ))}
              </div>
            </AdminField>
            <div className="flex gap-3">
              <AdminButton onClick={save}>{t("admin.products.save")}</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>
                {t("admin.products.cancel")}
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      <div className="mt-8 space-y-4">
        {state.products.map((p) => (
          <AdminCard key={p.id}>
            <div className="flex items-center gap-4">
              {p.image && (
                <img src={p.image} alt="" className="h-16 w-16 rounded-md object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-light text-foreground">{p.name.ar} / {p.name.en}</p>
                <p className="mt-1 text-[0.62rem] font-light tracking-[0.14em] text-muted-foreground">
                  {p.badges.map((b) => t(`badge.${b}`)).join(" · ")}
                </p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" onClick={() => startEdit(p)}>
                  {t("admin.products.edit")}
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  onClick={() => {
                    if (confirm(t("admin.products.confirmDelete"))) deleteProduct(p.id);
                  }}
                >
                  {t("admin.products.delete")}
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminLayout>
  );
}
