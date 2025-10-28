import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const KPIs = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Indicateurs de performance</h1>
          <p className="text-muted-foreground mt-2">
            Suivi des KPIs et tableaux de bord
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs clés</CardTitle>
            <CardDescription>
              Visualisez vos indicateurs de performance qualité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun indicateur configuré</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default KPIs;