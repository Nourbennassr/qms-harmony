import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  LayoutDashboard,
  FileText,
  GitBranch,
  AlertCircle,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
  GraduationCap,
  LogOut,
  User as UserIcon,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: GitBranch, label: "Processus", path: "/processus" },
    { icon: AlertCircle, label: "Non-conformités", path: "/non-conformites" },
    { icon: ClipboardCheck, label: "Audits", path: "/audits" },
    { icon: BarChart3, label: "Indicateurs", path: "/indicateurs" },
    { icon: AlertTriangle, label: "Risques", path: "/risques" },
    { icon: GraduationCap, label: "Formation", path: "/formation" },
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-semibold">QMS ISO 9001</span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  <NavItems mobile />
                </nav>
              </SheetContent>
            </Sheet>
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">QMS ISO 9001</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profil")}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:flex w-64 flex-col gap-1 border-r p-4 min-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-1">
            <NavItems />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;