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
import { useAdmin, type EmailSettings } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/email")({
  head: () => ({ meta: [{ title: "Email Settings — Admin" }] }),
  component: AdminEmailPage,
});

function AdminEmailPage() {
  const { t } = useI18n();
  const { state, updateEmail } = useAdmin();
  const [form, setForm] = useState<EmailSettings>(state.email);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateEmail(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.email.title")}</AdminSectionTitle>

      <AdminCard className="mt-8">
        <div className="space-y-5">
          <AdminField label={t("admin.email.smtpHost")}>
            <AdminInput
              value={form.smtpHost}
              onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
              dir="ltr"
              placeholder="smtp.example.com"
            />
          </AdminField>
          <AdminField label={t("admin.email.smtpPort")}>
            <AdminInput
              value={form.smtpPort}
              onChange={(e) => setForm({ ...form, smtpPort: e.target.value })}
              dir="ltr"
              placeholder="587"
            />
          </AdminField>
          <AdminField label={t("admin.email.smtpEmail")}>
            <AdminInput
              value={form.smtpEmail}
              onChange={(e) => setForm({ ...form, smtpEmail: e.target.value })}
              dir="ltr"
              placeholder="your-email@example.com"
            />
          </AdminField>
          <AdminField label={t("admin.email.smtpPassword")}>
            <AdminInput
              type="password"
              value={form.smtpPassword}
              onChange={(e) => setForm({ ...form, smtpPassword: e.target.value })}
              dir="ltr"
              placeholder="••••••••"
            />
          </AdminField>
          <AdminField label={t("admin.email.recipientEmail")}>
            <AdminInput
              value={form.recipientEmail}
              onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
              dir="ltr"
              placeholder="orders@rahiqparfums.dz"
            />
          </AdminField>

          <div className="flex items-center gap-4">
            <AdminButton onClick={handleSave}>{t("admin.email.save")}</AdminButton>
            {saved && (
              <span className="text-sm font-normal tracking-[0.08em] text-primary">
                {t("admin.email.saved")}
              </span>
            )}
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
