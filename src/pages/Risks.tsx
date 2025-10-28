import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Risks = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des risques</h1>
          <p className="text-muted-foreground mt-2">
            Identification, évaluation et traitement des risques
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Matrice des risques</CardTitle>
            <CardDescription>
              Cartographie et suivi des risques identifiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun risque enregistré</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Risks;