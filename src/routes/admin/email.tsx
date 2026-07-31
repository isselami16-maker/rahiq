import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AdminLayout,
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminSectionTitle,
} from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/email")({
  head: () => ({ meta: [{ title: "Email Settings — Admin" }] }),
  component: AdminEmailPage,
});

type EmailSettings = {
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  sender_email: string;
  recipient_email: string;
  reply_to_email: string;
  use_ssl: boolean;
};

const defaults: EmailSettings = {
  smtp_host: "",
  smtp_port: "587",
  smtp_username: "",
  smtp_password: "",
  sender_email: "",
  recipient_email: "",
  reply_to_email: "",
  use_ssl: false,
};

function AdminEmailPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<EmailSettings>(defaults);
  const [dirty, setDirty] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-email-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("email_settings").select("*").eq("id", 1).maybeSingle();
      return data as EmailSettings | null;
    },
  });

  useEffect(() => {
    if (data) setForm({ ...defaults, ...data });
  }, [data]);

  function update(patch: Partial<EmailSettings>) {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("email_settings")
        .upsert({ id: 1, ...form, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-email-settings"] });
      setDirty(false);
    },
  });

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Email Settings"
        description="SMTP configuration used to send order confirmation emails."
      />

      <div className="space-y-6">
        <AdminCard>
          <AdminSectionTitle>SMTP Server</AdminSectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminField label="SMTP Host">
              <AdminInput value={form.smtp_host} onChange={(e) => update({ smtp_host: e.target.value })} dir="ltr" placeholder="smtp.example.com" />
            </AdminField>
            <AdminField label="SMTP Port">
              <AdminInput value={form.smtp_port} onChange={(e) => update({ smtp_port: e.target.value })} dir="ltr" placeholder="587" />
            </AdminField>
            <AdminField label="Username">
              <AdminInput value={form.smtp_username} onChange={(e) => update({ smtp_username: e.target.value })} dir="ltr" placeholder="your@email.com" />
            </AdminField>
            <AdminField label="Password">
              <AdminInput type="password" value={form.smtp_password} onChange={(e) => update({ smtp_password: e.target.value })} dir="ltr" placeholder="••••••••" />
            </AdminField>
          </div>
          <div className="mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.use_ssl} onChange={(e) => update({ use_ssl: e.target.checked })} className="h-4 w-4 accent-primary" />
              <span className="text-sm text-foreground">Use SSL/TLS</span>
            </label>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminSectionTitle>Email Addresses</AdminSectionTitle>
          <div className="space-y-4">
            <AdminField label="Sender Email">
              <AdminInput value={form.sender_email} onChange={(e) => update({ sender_email: e.target.value })} dir="ltr" placeholder="orders@rahiqparfums.dz" />
            </AdminField>
            <AdminField label="Recipient Email (receives order notifications)">
              <AdminInput value={form.recipient_email} onChange={(e) => update({ recipient_email: e.target.value })} dir="ltr" placeholder="admin@rahiqparfums.dz" />
            </AdminField>
            <AdminField label="Reply-To Email">
              <AdminInput value={form.reply_to_email} onChange={(e) => update({ reply_to_email: e.target.value })} dir="ltr" placeholder="contact@rahiqparfums.dz" />
            </AdminField>
          </div>
        </AdminCard>

        <div className="flex items-center gap-3">
          <AdminButton onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !dirty}>
            {saveMutation.isPending ? "Saving..." : "Save Email Settings"}
          </AdminButton>
          {saveMutation.isSuccess && !dirty && (
            <span className="text-xs text-green-600 font-medium">Saved successfully</span>
          )}
          {saveMutation.isError && (
            <span className="text-xs text-red-600">Failed to save. Check your connection.</span>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
