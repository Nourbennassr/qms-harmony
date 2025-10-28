import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, ClipboardCheck, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    documents: 0,
    openNC: 0,
    upcomingAudits: 0,
    processes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [docsResult, ncResult, auditsResult, processesResult] = await Promise.all([
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("non_conformities").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("audits").select("*", { count: "exact", head: true }).eq("status", "planned"),
        supabase.from("processes").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        documents: docsResult.count || 0,
        openNC: ncResult.count || 0,
        upcomingAudits: auditsResult.count || 0,
        processes: processesResult.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      description: "Documents actifs",
      color: "text-blue-500",
    },
    {
      title: "Non-conformités ouvertes",
      value: stats.openNC,
      icon: AlertCircle,
      description: "À traiter",
      color: "text-red-500",
    },
    {
      title: "Audits planifiés",
      value: stats.upcomingAudits,
      icon: ClipboardCheck,
      description: "À venir",
      color: "text-green-500",
    },
    {
      title: "Processus",
      value: stats.processes,
      icon: TrendingUp,
      description: "Processus métier",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre système de gestion de la qualité
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Actions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune action récente à afficher
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune alerte en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines échéances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune échéance à venir
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;