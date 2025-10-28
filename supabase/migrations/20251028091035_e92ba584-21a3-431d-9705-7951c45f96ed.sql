-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'quality_manager', 'auditor', 'user');

-- Create enum for document status
CREATE TYPE public.document_status AS ENUM ('draft', 'under_review', 'approved', 'obsolete');

-- Create enum for non-conformity severity
CREATE TYPE public.nc_severity AS ENUM ('minor', 'major', 'critical');

-- Create enum for non-conformity status
CREATE TYPE public.nc_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'rejected');

-- Create enum for audit type
CREATE TYPE public.audit_type AS ENUM ('internal', 'external', 'certification', 'surveillance');

-- Create enum for audit status
CREATE TYPE public.audit_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT,
    position TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_number TEXT UNIQUE NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    status document_status NOT NULL DEFAULT 'draft',
    category TEXT NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    review_date TIMESTAMP WITH TIME ZONE,
    next_review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create processes table
CREATE TABLE public.processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    category TEXT,
    objectives TEXT,
    inputs TEXT,
    outputs TEXT,
    resources TEXT,
    kpis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create non_conformities table
CREATE TABLE public.non_conformities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nc_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity nc_severity NOT NULL,
    status nc_status NOT NULL DEFAULT 'open',
    source TEXT,
    detected_date TIMESTAMP WITH TIME ZONE NOT NULL,
    detected_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_to UUID REFERENCES auth.users(id),
    process_id UUID REFERENCES public.processes(id),
    root_cause TEXT,
    immediate_action TEXT,
    target_close_date TIMESTAMP WITH TIME ZONE,
    actual_close_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create corrective_actions table
CREATE TABLE public.corrective_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nc_id UUID REFERENCES public.non_conformities(id) ON DELETE CASCADE NOT NULL,
    action_number TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    responsible_id UUID REFERENCES auth.users(id) NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE,
    status nc_status NOT NULL DEFAULT 'open',
    effectiveness_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create audits table
CREATE TABLE public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    audit_type audit_type NOT NULL,
    status audit_status NOT NULL DEFAULT 'planned',
    scope TEXT NOT NULL,
    objectives TEXT,
    lead_auditor_id UUID REFERENCES auth.users(id) NOT NULL,
    audit_team TEXT[],
    planned_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    planned_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    processes_audited UUID[],
    findings_summary TEXT,
    report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create audit_findings table
CREATE TABLE public.audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
    finding_number TEXT NOT NULL,
    type TEXT NOT NULL,
    severity nc_severity,
    description TEXT NOT NULL,
    clause_reference TEXT,
    evidence TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create kpis table
CREATE TABLE public.kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    target_value DECIMAL,
    target_operator TEXT,
    frequency TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    process_id UUID REFERENCES public.processes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create kpi_values table
CREATE TABLE public.kpi_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE NOT NULL,
    period_date DATE NOT NULL,
    actual_value DECIMAL NOT NULL,
    target_value DECIMAL,
    notes TEXT,
    recorded_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (kpi_id, period_date)
);

-- Create risks table
CREATE TABLE public.risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    process_id UUID REFERENCES public.processes(id),
    probability INTEGER CHECK (probability >= 1 AND probability <= 5),
    impact INTEGER CHECK (impact >= 1 AND impact <= 5),
    risk_level INTEGER GENERATED ALWAYS AS (probability * impact) STORED,
    mitigation_plan TEXT,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create training_programs table
CREATE TABLE public.training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    duration_hours DECIMAL,
    trainer TEXT,
    objectives TEXT,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create training_sessions table
CREATE TABLE public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    trainer TEXT,
    max_participants INTEGER,
    status TEXT NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create training_attendance table
CREATE TABLE public.training_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    attended BOOLEAN DEFAULT false,
    score DECIMAL,
    certificate_issued BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (session_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_conformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_attendance ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'quality_manager' THEN 2
    WHEN 'auditor' THEN 3
    WHEN 'user' THEN 4
  END
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view approved documents" ON public.documents
  FOR SELECT TO authenticated USING (
    status = 'approved' OR 
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

CREATE POLICY "Quality managers and admins can manage documents" ON public.documents
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for processes
CREATE POLICY "Authenticated users can view processes" ON public.processes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Quality managers and admins can manage processes" ON public.processes
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager') OR
    owner_id = auth.uid()
  );

-- RLS Policies for non_conformities
CREATE POLICY "Authenticated users can view non-conformities" ON public.non_conformities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create non-conformities" ON public.non_conformities
  FOR INSERT WITH CHECK (auth.uid() = detected_by);

CREATE POLICY "Assigned users and managers can update non-conformities" ON public.non_conformities
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    detected_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- RLS Policies for corrective_actions
CREATE POLICY "Authenticated users can view corrective actions" ON public.corrective_actions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Quality managers can create corrective actions" ON public.corrective_actions
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

CREATE POLICY "Responsible users and managers can update actions" ON public.corrective_actions
  FOR UPDATE USING (
    responsible_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- RLS Policies for audits
CREATE POLICY "Authenticated users can view audits" ON public.audits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auditors and managers can manage audits" ON public.audits
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager') OR
    public.has_role(auth.uid(), 'auditor') OR
    lead_auditor_id = auth.uid()
  );

-- RLS Policies for audit_findings
CREATE POLICY "Authenticated users can view audit findings" ON public.audit_findings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auditors can manage findings" ON public.audit_findings
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager') OR
    public.has_role(auth.uid(), 'auditor')
  );

-- RLS Policies for kpis
CREATE POLICY "Authenticated users can view KPIs" ON public.kpis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage KPIs" ON public.kpis
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager') OR
    owner_id = auth.uid()
  );

-- RLS Policies for kpi_values
CREATE POLICY "Authenticated users can view KPI values" ON public.kpi_values
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can record KPI values" ON public.kpi_values
  FOR INSERT WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Recorders and managers can update KPI values" ON public.kpi_values
  FOR UPDATE USING (
    recorded_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- RLS Policies for risks
CREATE POLICY "Authenticated users can view risks" ON public.risks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage risks" ON public.risks
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager') OR
    owner_id = auth.uid()
  );

-- RLS Policies for training_programs
CREATE POLICY "Authenticated users can view training programs" ON public.training_programs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage training programs" ON public.training_programs
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- RLS Policies for training_sessions
CREATE POLICY "Authenticated users can view training sessions" ON public.training_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage training sessions" ON public.training_sessions
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- RLS Policies for training_attendance
CREATE POLICY "Users can view their own attendance" ON public.training_attendance
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

CREATE POLICY "Managers can manage attendance" ON public.training_attendance
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'quality_manager')
  );

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON public.processes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_non_conformities_updated_at BEFORE UPDATE ON public.non_conformities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_corrective_actions_updated_at BEFORE UPDATE ON public.corrective_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audit_findings_updated_at BEFORE UPDATE ON public.audit_findings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON public.kpis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON public.training_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON public.training_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    NEW.email
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();