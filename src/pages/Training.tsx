import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Training = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion de la formation</h1>
          <p className="text-muted-foreground mt-2">
            Plans de formation et suivi des compétences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Programmes de formation</CardTitle>
            <CardDescription>
              Gérez les sessions de formation et la présence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun programme de formation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Training;