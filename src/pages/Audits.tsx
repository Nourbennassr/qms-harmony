import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardCheck } from "lucide-react";
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

interface Audit {
  id: string;
  audit_number: string;
  title: string;
  audit_type: string;
  status: string;
  planned_start_date: string;
  planned_end_date: string;
}

const Audits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    audit_number: "",
    title: "",
    audit_type: "",
    scope: "",
    objectives: "",
    planned_start_date: "",
    planned_end_date: "",
  });

  const fetchAudits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .order("planned_start_date", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les audits",
      });
    } else {
      setAudits(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("audits").insert({
      ...formData,
      lead_auditor_id: user.id,
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
        description: "Audit créé avec succès",
      });
      setOpen(false);
      setFormData({
        audit_number: "",
        title: "",
        audit_type: "",
        scope: "",
        objectives: "",
        planned_start_date: "",
        planned_end_date: "",
      });
      fetchAudits();
    }
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      internal: "Interne",
      external: "Externe",
      certification: "Certification",
      surveillance: "Surveillance",
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      planned: { variant: "outline", label: "Planifié" },
      in_progress: { variant: "secondary", label: "En cours" },
      completed: { variant: "default", label: "Terminé" },
      cancelled: { variant: "destructive", label: "Annulé" },
    };
    const config = variants[status] || variants.planned;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audits</h1>
            <p className="text-muted-foreground mt-2">
              Planification et suivi des audits qualité
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Planifier un nouvel audit</DialogTitle>
                <DialogDescription>
                  Définissez les paramètres de l'audit
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audit_number">Numéro d'audit *</Label>
                    <Input
                      id="audit_number"
                      value={formData.audit_number}
                      onChange={(e) => setFormData({ ...formData, audit_number: e.target.value })}
                      placeholder="AUD-2025-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audit_type">Type d'audit *</Label>
                    <Select
                      value={formData.audit_type}
                      onValueChange={(value) => setFormData({ ...formData, audit_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Audit interne</SelectItem>
                        <SelectItem value="external">Audit externe</SelectItem>
                        <SelectItem value="certification">Certification</SelectItem>
                        <SelectItem value="surveillance">Surveillance</SelectItem>
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
                  <Label htmlFor="scope">Périmètre *</Label>
                  <Textarea
                    id="scope"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectifs</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planned_start_date">Date de début *</Label>
                    <Input
                      id="planned_start_date"
                      type="date"
                      value={formData.planned_start_date}
                      onChange={(e) => setFormData({ ...formData, planned_start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planned_end_date">Date de fin *</Label>
                    <Input
                      id="planned_end_date"
                      type="date"
                      value={formData.planned_end_date}
                      onChange={(e) => setFormData({ ...formData, planned_end_date: e.target.value })}
                      required
                    />
                  </div>
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

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : audits.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ClipboardCheck className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun audit planifié</p>
            </div>
          ) : (
            audits.map((audit) => (
              <Card key={audit.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{audit.title}</CardTitle>
                      <CardDescription>{audit.audit_number}</CardDescription>
                    </div>
                    <div className="space-y-1">
                      {getTypeBadge(audit.audit_type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {new Date(audit.planned_start_date).toLocaleDateString('fr-FR')} - {new Date(audit.planned_end_date).toLocaleDateString('fr-FR')}
                    </div>
                    {getStatusBadge(audit.status)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Audits;