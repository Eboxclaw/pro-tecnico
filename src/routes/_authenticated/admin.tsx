import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { mergedDemand, useSystemDemand } from "@/lib/systems-demand";
import { REJENDARI_SYSTEMS, SYSTEM_STATUS_LABEL, isReservable } from "@/data/systems";
import { DemandProgress } from "@/components/systems/SystemPrimitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Demand dashboard, REJENDARI" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();

  const roleQuery = useQuery({
    queryKey: ["admin-role"],
    queryFn: async (): Promise<string | null> => {
      if (!isSupabaseConfigured()) return null;
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();
      return data?.role ?? "customer";
    },
  });

  const reservationsQuery = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase
        .from("system_reservations")
        .select("id,system_id,user_id,quantity,profession,status,created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: roleQuery.data === "admin",
  });

  const emailsQuery = useQuery({
    queryKey: ["admin-profile-emails"],
    queryFn: async (): Promise<
      Record<string, { email: string; customer_code: string | null; region: string | null }>
    > => {
      if (!isSupabaseConfigured()) return {};
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,customer_code,region");
      if (error) return {};
      const map: Record<
        string,
        { email: string; customer_code: string | null; region: string | null }
      > = {};
      for (const row of data ?? []) {
        map[row.id] = {
          email: row.email ?? "-",
          customer_code: row.customer_code,
          region: row.region,
        };
      }
      return map;
    },
    enabled: roleQuery.data === "admin",
  });

  const likesTodayQuery = useQuery({
    queryKey: ["admin-likes-today"],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!isSupabaseConfigured()) return {};
      const { data, error } = await supabase.rpc("admin_likes_today");
      if (error || !data) return {};
      const map: Record<string, number> = {};
      for (const row of data) map[row.system_id] = Number(row.likes_last_24h ?? 0);
      return map;
    },
    enabled: roleQuery.data === "admin",
  });

  const customersQuery = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      if (!isSupabaseConfigured()) return [];
      const { data, error } = await supabase.rpc("admin_customers");
      if (error) throw error;
      return data ?? [];
    },
    enabled: roleQuery.data === "admin",
  });

  const { data: demandBySystem } = useSystemDemand();

  const isAdmin = roleQuery.data === "admin";
  useEffect(() => {
    if (roleQuery.isSuccess && !isAdmin) navigate({ to: "/conta", replace: true });
  }, [roleQuery.isSuccess, isAdmin, navigate]);

  const emails = emailsQuery.data ?? {};
  const professionBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const reservation of reservationsQuery.data ?? []) {
      if (!reservation.profession || reservation.status !== "active") continue;
      counts[reservation.profession] = (counts[reservation.profession] ?? 0) + reservation.quantity;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [reservationsQuery.data]);

  if (roleQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24" role="status">
        A verificar acesso…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">Acesso restrito.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Esta área é apenas para a equipa REJENDARI. A redirecionar para a tua conta…
        </p>
        <Button className="mt-6 rounded-none" asChild>
          <Link to="/conta">Ir para a conta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <p className="jp-label text-primary">仕入れ · demand dashboard</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            Procura por system
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Contadores = procura registada (seed) + interações online reais. As reservas recentes
            mostram os pedidos individuais com quantidade e profissão, é isto que alimenta a
            negociação de MOQ.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
        <section className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Likes</th>
                <th className="px-4 py-3 text-right">Likes 24h</th>
                <th className="px-4 py-3 text-right">Favoritos</th>
                <th className="px-4 py-3 text-right">Reservas</th>
                <th className="px-4 py-3 text-right">Unidades</th>
                <th className="px-4 py-3">MOQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REJENDARI_SYSTEMS.map((system) => {
                const demand = mergedDemand(system, demandBySystem?.[system.id]);
                return (
                  <tr key={system.id}>
                    <td className="px-4 py-3">
                      <Link
                        to="/systems/$id"
                        params={{ id: system.id }}
                        className="font-medium hover:text-primary"
                      >
                        {system.name}
                      </Link>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {system.kind === "system" ? "system" : "módulo"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                        {SYSTEM_STATUS_LABEL[system.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{demand.likes}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      <span
                        className={
                          (likesTodayQuery.data?.[system.id] ?? 0) > 40 ? "text-primary" : ""
                        }
                      >
                        {likesTodayQuery.data?.[system.id] ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{demand.favorites}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {demand.reservations}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{demand.units}</td>
                    <td className="px-4 py-3">
                      {system.targetMoq ? (
                        <DemandProgress
                          units={demand.units}
                          moq={system.targetMoq}
                          className="min-w-40"
                        />
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                          -
                        </span>
                      )}
                      {system.targetMoq && isReservable(system) ? (
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                          faltam {Math.max(0, system.targetMoq - demand.units)}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-6 border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="tech-label text-muted-foreground">
              Preço justo por system (das reservas com preço indicado)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  <th className="px-4 py-2.5">System</th>
                  <th className="px-4 py-2.5 text-right">Indicações</th>
                  <th className="px-4 py-2.5 text-right">Mín</th>
                  <th className="px-4 py-2.5 text-right">Média</th>
                  <th className="px-4 py-2.5 text-right">Máx</th>
                  <th className="px-4 py-2.5">Leitura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {REJENDARI_SYSTEMS.map((system) => {
                  const prices = (reservationsQuery.data ?? [])
                    .filter((r) => r.system_id === system.id && r.fair_price != null)
                    .map((r) => Number(r.fair_price))
                    .sort((a, b) => a - b);
                  if (prices.length === 0) {
                    return (
                      <tr key={system.id}>
                        <td className="px-4 py-2.5 text-xs">{system.name}</td>
                        <td colSpan={5} className="px-4 py-2.5 text-xs text-muted-foreground">
                          Sem preços indicados ainda.
                        </td>
                      </tr>
                    );
                  }
                  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                  return (
                    <tr key={system.id}>
                      <td className="px-4 py-2.5 text-xs">{system.name}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs">{prices.length}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs">€{prices[0]}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs">
                        €{Math.round(avg)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs">
                        €{prices[prices.length - 1]}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        alvo de negociação: €{Math.round(avg)}
                        {system.targetPriceEur
                          ? ` (target €${system.targetPriceEur.min}-${system.targetPriceEur.max})`
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="border border-border bg-card">
            <div className="border-b border-border p-5">
              <p className="tech-label text-muted-foreground">
                Reservas recentes ({reservationsQuery.data?.length ?? 0})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                    <th className="px-4 py-2.5">Data</th>
                    <th className="px-4 py-2.5">Cliente</th>
                    <th className="px-4 py-2.5">Região</th>
                    <th className="px-4 py-2.5">System</th>
                    <th className="px-4 py-2.5 text-right">Qtd.</th>
                    <th className="px-4 py-2.5 text-right">Preço justo</th>
                    <th className="px-4 py-2.5">Motivo</th>
                    <th className="px-4 py-2.5">Profissão</th>
                    <th className="px-4 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(reservationsQuery.data ?? []).map((reservation) => {
                    const customer = emails[reservation.user_id];
                    return (
                      <tr key={reservation.id}>
                        <td className="px-4 py-2.5 font-mono text-xs">
                          {new Date(reservation.created_at).toLocaleDateString("pt-PT")}
                        </td>
                        <td className="px-4 py-2.5 text-xs">
                          <p>{customer?.email ?? reservation.user_id.slice(0, 8)}</p>
                          {customer?.customer_code ? (
                            <p className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-primary">
                              {customer.customer_code}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-2.5 text-xs">{customer?.region ?? "-"}</td>
                        <td className="px-4 py-2.5 text-xs">{reservation.system_id}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          {reservation.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          {reservation.fair_price != null ? `€${reservation.fair_price}` : "-"}
                        </td>
                        <td
                          className="max-w-40 truncate px-4 py-2.5 text-xs"
                          title={reservation.reason ?? ""}
                        >
                          {reservation.reason ?? "-"}
                        </td>
                        <td className="px-4 py-2.5 text-xs">{reservation.profession ?? "-"}</td>
                        <td className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                          {reservation.status}
                        </td>
                      </tr>
                    );
                  })}
                  {(reservationsQuery.data ?? []).length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-sm text-muted-foreground">
                        Ainda sem reservas online. A procura seed aparece nos contadores acima.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="border border-border bg-card">
            <div className="border-b border-border p-5">
              <p className="tech-label text-muted-foreground">Quem quer o quê</p>
            </div>
            <ul className="divide-y divide-border">
              {professionBreakdown.map(([profession, units]) => (
                <li
                  key={profession}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
                >
                  <span>{profession}</span>
                  <span className="font-mono text-xs text-primary">{units} un.</span>
                </li>
              ))}
              {professionBreakdown.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted-foreground">
                  Sem profissões registadas ainda.
                </li>
              )}
            </ul>
          </section>
        </div>

        <section className="mt-6 border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="tech-label text-muted-foreground">
              Clientes ({customersQuery.data?.length ?? 0}), histórico de compras, pontos e
              atividade
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  <th className="px-4 py-2.5">Código</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Região</th>
                  <th className="px-4 py-2.5">C. postal</th>
                  <th className="px-4 py-2.5 text-right">Pontos</th>
                  <th className="px-4 py-2.5 text-right">Encomendas</th>
                  <th className="px-4 py-2.5 text-right">Total EUR</th>
                  <th className="px-4 py-2.5 text-right">Reservas</th>
                  <th className="px-4 py-2.5">Última atividade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(customersQuery.data ?? []).map((customer) => (
                  <tr key={customer.user_id}>
                    <td className="px-4 py-2.5 font-mono text-xs tracking-[0.1em] text-primary">
                      {customer.customer_code ?? "-"}
                    </td>
                    <td className="px-4 py-2.5 text-xs">{customer.email ?? "-"}</td>
                    <td className="px-4 py-2.5 text-xs">{customer.region ?? "-"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{customer.postal_code ?? "-"}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{customer.points}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">
                      {customer.orders_count}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">
                      {new Intl.NumberFormat("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(customer.orders_total_eur ?? 0))}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">
                      {customer.reservations_count}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {new Date(customer.last_activity).toLocaleDateString("pt-PT")}
                    </td>
                  </tr>
                ))}
                {(customersQuery.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
                      Ainda sem clientes registados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
