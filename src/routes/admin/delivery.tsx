import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AdminLayout,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminButton,
} from "@/components/admin/AdminLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/admin/delivery")({
  head: () => ({ meta: [{ title: "Delivery Prices — Admin" }] }),
  component: AdminDeliveryPage,
});

type WilayaRow = {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  home_delivery_price: number;
  office_delivery_price: number;
  free_delivery: boolean;
};

function AdminDeliveryPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const { data: wilayas = [], isLoading } = useQuery({
    queryKey: ["admin-wilayas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wilayas")
        .select("id, code, name_ar, name_en, home_delivery_price, office_delivery_price, free_delivery")
        .order("display_order");
      if (error) throw error;
      return data as WilayaRow[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      home_delivery_price,
      office_delivery_price,
      free_delivery,
    }: {
      id: string;
      home_delivery_price: number;
      office_delivery_price: number;
      free_delivery: boolean;
    }) => {
      const { error } = await supabase
        .from("wilayas")
        .update({ home_delivery_price, office_delivery_price, free_delivery })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-wilayas"] });
      setSaved(variables.id);
      setTimeout(() => setSaved(null), 2000);
    },
  });

  const [localPrices, setLocalPrices] = useState<
    Record<string, { home: number; office: number; free: boolean }>
  >({});

  function getPrice(w: WilayaRow) {
    return localPrices[w.id] ?? { home: w.home_delivery_price, office: w.office_delivery_price, free: w.free_delivery };
  }

  function updateLocal(id: string, patch: Partial<{ home: number; office: number; free: boolean }>) {
    const w = wilayas.find((w) => w.id === id);
    if (!w) return;
    setLocalPrices((prev) => ({
      ...prev,
      [id]: { ...getPrice(w), ...patch },
    }));
  }

  function saveWilaya(w: WilayaRow) {
    const p = getPrice(w);
    updateMutation.mutate({
      id: w.id,
      home_delivery_price: p.home,
      office_delivery_price: p.office,
      free_delivery: p.free,
    });
  }

  const filtered = wilayas.filter(
    (w) =>
      w.name_ar.includes(search) ||
      w.name_en.toLowerCase().includes(search.toLowerCase()) ||
      w.code.includes(search),
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Delivery Prices"
        description="Set home and office delivery prices per wilaya."
      />

      <div className="mb-4">
        <AdminInput
          placeholder="Search by wilaya name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => {
            const p = getPrice(w);
            const isSaving = updateMutation.isPending && updateMutation.variables?.id === w.id;
            const isSaved = saved === w.id;
            return (
              <AdminCard key={w.id} className="flex flex-col gap-3 sm:flex-row sm:items-center py-3">
                <span className="w-40 shrink-0 text-sm text-foreground font-medium">
                  <span className="text-muted-foreground text-xs">{w.code}</span>{" "}
                  {w.name_ar}
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Home (DA)</span>
                    <AdminInput
                      type="number"
                      value={p.home}
                      onChange={(e) => updateLocal(w.id, { home: Number(e.target.value) })}
                      className="w-24"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Office (DA)</span>
                    <AdminInput
                      type="number"
                      value={p.office}
                      onChange={(e) => updateLocal(w.id, { office: Number(e.target.value) })}
                      className="w-24"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.free}
                      onChange={(e) => updateLocal(w.id, { free: e.target.checked })}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">Free</span>
                  </label>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isSaved && <Check className="h-4 w-4 text-green-600" />}
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => saveWilaya(w)}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </AdminButton>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
