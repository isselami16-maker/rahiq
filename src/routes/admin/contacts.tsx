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
import { useAdmin, type ContactLinks } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({ meta: [{ title: "Contact Links — Admin" }] }),
  component: AdminContactsPage,
});

const FIELDS: { field: keyof ContactLinks; labelKey: string }[] = [
  { field: "instagram", labelKey: "admin.contact.instagram" },
  { field: "tiktok", labelKey: "admin.contact.tiktok" },
  { field: "facebook", labelKey: "admin.contact.facebook" },
  { field: "telegram", labelKey: "admin.contact.telegram" },
  { field: "whatsapp", labelKey: "admin.contact.whatsapp" },
  { field: "email", labelKey: "admin.contact.email" },
];

function AdminContactsPage() {
  const { t } = useI18n();
  const { state, updateContacts } = useAdmin();
  const [form, setForm] = useState<ContactLinks>(state.contacts);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateContacts(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <AdminSectionTitle>{t("admin.contact")}</AdminSectionTitle>

      <AdminCard className="mt-8">
        <div className="space-y-5">
          {FIELDS.map(({ field, labelKey }) => (
            <AdminField key={field} label={t(labelKey)}>
              <AdminInput
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                dir="ltr"
              />
            </AdminField>
          ))}
          <div className="flex items-center gap-4">
            <AdminButton onClick={handleSave}>{t("admin.contact.save")}</AdminButton>
            {saved && (
              <span className="text-[0.62rem] font-light tracking-[0.14em] text-primary">
                {t("admin.contact.saved")}
              </span>
            )}
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
