import { useState } from "react";
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
  AdminBadge,
} from "@/components/admin/AdminLayout";
import { ChevronDown, ChevronRight, Plus, Pencil, Check, X, Download, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/algeria")({
  head: () => ({ meta: [{ title: "Algeria Data — Admin" }] }),
  component: AdminAlgeriaPage,
});

type WilayaRow = {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  home_delivery_price: number;
  office_delivery_price: number;
  municipalities?: MunicipalityRow[];
};

type MunicipalityRow = {
  id: string;
  wilaya_id: string;
  name_ar: string;
  name_en: string;
  is_enabled: boolean;
  display_order: number;
};

function AdminAlgeriaPage() {
  const qc = useQueryClient();
  const [expandedWilaya, setExpandedWilaya] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingMuni, setEditingMuni] = useState<{ id: string; name_ar: string; name_en: string } | null>(null);
  const [addingMuni, setAddingMuni] = useState<{ wilayaId: string; name_ar: string; name_en: string } | null>(null);

  const { data: wilayas = [], isLoading } = useQuery({
    queryKey: ["admin-algeria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wilayas")
        .select("id, code, name_ar, name_en, home_delivery_price, office_delivery_price, municipalities(id, wilaya_id, name_ar, name_en, is_enabled, display_order)")
        .order("display_order");
      if (error) throw error;
      return data as WilayaRow[];
    },
  });

  const updateMuniMutation = useMutation({
    mutationFn: async (muni: { id: string; name_ar: string; name_en: string }) => {
      const { error } = await supabase
        .from("municipalities")
        .update({ name_ar: muni.name_ar, name_en: muni.name_en })
        .eq("id", muni.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-algeria"] });
      setEditingMuni(null);
    },
  });

  const toggleMuniMutation = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase.from("municipalities").update({ is_enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-algeria"] }),
  });

  const addMuniMutation = useMutation({
    mutationFn: async ({ wilayaId, name_ar, name_en }: { wilayaId: string; name_ar: string; name_en: string }) => {
      const { error } = await supabase.from("municipalities").insert({ wilaya_id: wilayaId, name_ar, name_en, is_enabled: true });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-algeria"] });
      setAddingMuni(null);
    },
  });

  function handleExport() {
    const json = JSON.stringify(
      wilayas.map((w) => ({
        code: w.code,
        name_ar: w.name_ar,
        name_en: w.name_en,
        municipalities: w.municipalities?.map((m) => ({ name_ar: m.name_ar, name_en: m.name_en, is_enabled: m.is_enabled })),
      })),
      null,
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algeria-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text) as { code: string; municipalities?: { name_ar: string; name_en: string }[] }[];
      for (const w of imported) {
        const wilaya = wilayas.find((ww) => ww.code === w.code);
        if (!wilaya || !w.municipalities) continue;
        for (const m of w.municipalities) {
          await supabase
            .from("municipalities")
            .insert({ wilaya_id: wilaya.id, name_ar: m.name_ar, name_en: m.name_en, is_enabled: true })
            .select();
        }
      }
      qc.invalidateQueries({ queryKey: ["admin-algeria"] });
    } catch {
      alert("Invalid JSON file.");
    }
  }

  const filteredWilayas = wilayas.filter(
    (w) =>
      w.name_ar.includes(search) ||
      w.name_en.toLowerCase().includes(search.toLowerCase()) ||
      w.code.includes(search) ||
      (search.length >= 2 &&
        w.municipalities?.some(
          (m) => m.name_ar.includes(search) || m.name_en.toLowerCase().includes(search.toLowerCase()),
        )),
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Algeria Administrative Data"
        description="Manage wilayas and municipalities. Used by delivery and orders."
        action={
          <div className="flex gap-2">
            <AdminButton variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Export JSON
            </AdminButton>
            <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5" /> Import JSON
              <input type="file" accept=".json" className="sr-only" onChange={handleImport} />
            </label>
          </div>
        }
      />

      <div className="mb-4">
        <AdminInput
          placeholder="Search wilayas or municipalities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-muted/50 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {filteredWilayas.map((w) => {
            const isExpanded = expandedWilaya === w.id;
            const munis = w.municipalities ?? [];
            const enabledCount = munis.filter((m) => m.is_enabled).length;
            const filteredMunis = search.length >= 2
              ? munis.filter((m) => m.name_ar.includes(search) || m.name_en.toLowerCase().includes(search.toLowerCase()))
              : munis;

            return (
              <AdminCard key={w.id} className="py-3">
                <button
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => setExpandedWilaya(isExpanded ? null : w.id)}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  <span className="text-xs font-mono text-muted-foreground w-6">{w.code}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{w.name_ar}</span>
                  <span className="text-xs text-muted-foreground">{enabledCount}/{munis.length} municipalities</span>
                </button>

                {isExpanded && (
                  <div className="mt-3 ml-10 space-y-1.5 border-t border-border pt-3">
                    {filteredMunis.map((m) => (
                      <div key={m.id} className="flex items-center gap-3">
                        {editingMuni?.id === m.id ? (
                          <>
                            <AdminInput
                              value={editingMuni.name_ar}
                              onChange={(e) => setEditingMuni({ ...editingMuni, name_ar: e.target.value })}
                              dir="rtl"
                              className="flex-1 py-1.5 text-xs"
                            />
                            <AdminInput
                              value={editingMuni.name_en}
                              onChange={(e) => setEditingMuni({ ...editingMuni, name_en: e.target.value })}
                              className="flex-1 py-1.5 text-xs"
                            />
                            <AdminButton size="sm" onClick={() => updateMuniMutation.mutate(editingMuni)}>
                              <Check className="h-3 w-3" />
                            </AdminButton>
                            <AdminButton variant="ghost" size="sm" onClick={() => setEditingMuni(null)}>
                              <X className="h-3 w-3" />
                            </AdminButton>
                          </>
                        ) : (
                          <>
                            <span className={`flex-1 text-sm ${m.is_enabled ? "text-foreground" : "text-muted-foreground line-through"}`}>
                              {m.name_ar}
                            </span>
                            <AdminBadge variant={m.is_enabled ? "success" : "default"}>
                              {m.is_enabled ? "Active" : "Disabled"}
                            </AdminBadge>
                            <AdminButton
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingMuni({ id: m.id, name_ar: m.name_ar, name_en: m.name_en })}
                            >
                              <Pencil className="h-3 w-3" />
                            </AdminButton>
                            <AdminButton
                              variant={m.is_enabled ? "ghost" : "ghost"}
                              size="sm"
                              onClick={() => toggleMuniMutation.mutate({ id: m.id, is_enabled: !m.is_enabled })}
                            >
                              {m.is_enabled ? "Disable" : "Enable"}
                            </AdminButton>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add municipality */}
                    {addingMuni?.wilayaId === w.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <AdminInput
                          value={addingMuni.name_ar}
                          onChange={(e) => setAddingMuni({ ...addingMuni, name_ar: e.target.value })}
                          placeholder="Arabic name"
                          dir="rtl"
                          className="flex-1 py-1.5 text-xs"
                        />
                        <AdminInput
                          value={addingMuni.name_en}
                          onChange={(e) => setAddingMuni({ ...addingMuni, name_en: e.target.value })}
                          placeholder="English name"
                          className="flex-1 py-1.5 text-xs"
                        />
                        <AdminButton
                          size="sm"
                          onClick={() => addMuniMutation.mutate({ wilayaId: w.id, name_ar: addingMuni.name_ar, name_en: addingMuni.name_en })}
                          disabled={addMuniMutation.isPending}
                        >
                          <Check className="h-3 w-3" />
                        </AdminButton>
                        <AdminButton variant="ghost" size="sm" onClick={() => setAddingMuni(null)}>
                          <X className="h-3 w-3" />
                        </AdminButton>
                      </div>
                    ) : (
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={() => setAddingMuni({ wilayaId: w.id, name_ar: "", name_en: "" })}
                      >
                        <Plus className="h-3 w-3" /> Add Municipality
                      </AdminButton>
                    )}
                  </div>
                )}
              </AdminCard>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
