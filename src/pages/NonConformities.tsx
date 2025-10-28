import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NonConformity {
  id: string;
  nc_number: string;
  title: string;
  severity: string;
  status: string;
  detected_date: string;
}

const NonConformities = () => {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nc_number: "",
    title: "",
    description: "",
    severity: "",
    source: "",
  });

  const fetchNonConformities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("non_conformities")
      .select("*")
      .order("detected_date", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les non-conformités",
      });
    } else {
      setNonConformities(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNonConformities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("non_conformities").insert({
      ...formData,
      detected_by: user.id,
      detected_date: new Date().toISOString(),
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } else {
      toast({
        title: "Succès",
        description: "Non-conformité créée avec succès",
      });
      setOpen(false);
      setFormData({ nc_number: "", title: "", description: "", severity: "", source: "" });
      fetchNonConformities();
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
      minor: { variant: "secondary", color: "text-yellow-600" },
      major: { variant: "default", color: "text-orange-600" },
      critical: { variant: "destructive", color: "text-red-600" },
    };
    const config = variants[severity] || variants.minor;
    return <Badge variant={config.variant} className={config.color}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      open: "destructive",
      in_progress: "outline",
      resolved: "secondary",
      closed: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Non-conformités</h1>
            <p className="text-muted-foreground mt-2">
              Suivi et gestion des non-conformités
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle NC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Déclarer une non-conformité</DialogTitle>
                <DialogDescription>
                  Enregistrez les détails de la non-conformité détectée
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nc_number">Numéro NC *</Label>
                    <Input
                      id="nc_number"
                      value={formData.nc_number}
                      onChange={(e) => setFormData({ ...formData, nc_number: e.target.value })}
                      placeholder="NC-2025-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Sévérité *</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) => setFormData({ ...formData, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Mineure</SelectItem>
                        <SelectItem value="major">Majeure</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Audit, réclamation client, inspection..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des non-conformités</CardTitle>
            <CardDescription>
              {nonConformities.length} non-conformité(s) enregistrée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : nonConformities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Aucune non-conformité enregistrée</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Sévérité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de détection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonConformities.map((nc) => (
                    <TableRow key={nc.id}>
                      <TableCell className="font-medium">{nc.nc_number}</TableCell>
                      <TableCell>{nc.title}</TableCell>
                      <TableCell>{getSeverityBadge(nc.severity)}</TableCell>
                      <TableCell>{getStatusBadge(nc.status)}</TableCell>
                      <TableCell>{new Date(nc.detected_date).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NonConformities;