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
import { useAdmin, type BrandSettings } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Brand Settings — Admin" }] }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { t } = useI18n();
  const { state, updateBrand } = useAdmin();
  const [form, setForm] = useState<BrandSettings>(state.brand);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateBrand(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.brandSettings")}</AdminSectionTitle>

      <AdminCard className="mt-8">
        <div className="space-y-5">
          <AdminField label={t("admin.brand.name")}>
            <AdminInput
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            />
          </AdminField>
          <AdminField label={t("admin.brand.logoUrl")}>
            <AdminInput
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              dir="ltr"
              placeholder="/images/logo/logo.png"
            />
          </AdminField>
          <AdminField label={t("admin.brand.heroLogoUrl")}>
            <AdminInput
              value={form.heroLogoUrl}
              onChange={(e) => setForm({ ...form, heroLogoUrl: e.target.value })}
              dir="ltr"
              placeholder="/images/logo/logo.png"
            />
          </AdminField>

          {/* Favicon — display only, not editable */}
          <AdminField label={t("admin.brand.favicon")}>
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
              <img
                src={form.faviconUrl || "/favicon.ico"}
                alt="Favicon"
                className="h-8 w-8 rounded"
              />
              <span className="text-sm font-normal text-muted-foreground">
                {form.faviconUrl || "/favicon.ico"}
              </span>
            </div>
          </AdminField>

          {/* Logo preview */}
          <div className="rounded-lg border border-border/70 p-4">
            <p className="mb-3 text-sm font-normal tracking-[0.08em] text-muted-foreground">
              {t("admin.brand.logo")}
            </p>
            <img
              src={form.logoUrl || "/images/logo/logo.png"}
              alt="Logo preview"
              className="h-16 w-auto"
            />
          </div>

          <div className="flex items-center gap-4">
            <AdminButton onClick={handleSave}>{t("admin.brand.save")}</AdminButton>
            {saved && (
              <span className="text-sm font-normal tracking-[0.08em] text-primary">
                {t("admin.brand.saved")}
              </span>
            )}
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
