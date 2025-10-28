export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_findings: {
        Row: {
          audit_id: string
          clause_reference: string | null
          created_at: string
          description: string
          evidence: string | null
          finding_number: string
          id: string
          recommendation: string | null
          severity: Database["public"]["Enums"]["nc_severity"] | null
          type: string
          updated_at: string
        }
        Insert: {
          audit_id: string
          clause_reference?: string | null
          created_at?: string
          description: string
          evidence?: string | null
          finding_number: string
          id?: string
          recommendation?: string | null
          severity?: Database["public"]["Enums"]["nc_severity"] | null
          type: string
          updated_at?: string
        }
        Update: {
          audit_id?: string
          clause_reference?: string | null
          created_at?: string
          description?: string
          evidence?: string | null
          finding_number?: string
          id?: string
          recommendation?: string | null
          severity?: Database["public"]["Enums"]["nc_severity"] | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          audit_number: string
          audit_team: string[] | null
          audit_type: Database["public"]["Enums"]["audit_type"]
          created_at: string
          findings_summary: string | null
          id: string
          lead_auditor_id: string
          objectives: string | null
          planned_end_date: string
          planned_start_date: string
          processes_audited: string[] | null
          report_url: string | null
          scope: string
          status: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          audit_number: string
          audit_team?: string[] | null
          audit_type: Database["public"]["Enums"]["audit_type"]
          created_at?: string
          findings_summary?: string | null
          id?: string
          lead_auditor_id: string
          objectives?: string | null
          planned_end_date: string
          planned_start_date: string
          processes_audited?: string[] | null
          report_url?: string | null
          scope: string
          status?: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          audit_number?: string
          audit_team?: string[] | null
          audit_type?: Database["public"]["Enums"]["audit_type"]
          created_at?: string
          findings_summary?: string | null
          id?: string
          lead_auditor_id?: string
          objectives?: string | null
          planned_end_date?: string
          planned_start_date?: string
          processes_audited?: string[] | null
          report_url?: string | null
          scope?: string
          status?: Database["public"]["Enums"]["audit_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      corrective_actions: {
        Row: {
          action_number: string
          completion_date: string | null
          created_at: string
          description: string
          effectiveness_verified: boolean | null
          id: string
          nc_id: string
          responsible_id: string
          status: Database["public"]["Enums"]["nc_status"]
          target_date: string
          updated_at: string
          verification_notes: string | null
        }
        Insert: {
          action_number: string
          completion_date?: string | null
          created_at?: string
          description: string
          effectiveness_verified?: boolean | null
          id?: string
          nc_id: string
          responsible_id: string
          status?: Database["public"]["Enums"]["nc_status"]
          target_date: string
          updated_at?: string
          verification_notes?: string | null
        }
        Update: {
          action_number?: string
          completion_date?: string | null
          created_at?: string
          description?: string
          effectiveness_verified?: boolean | null
          id?: string
          nc_id?: string
          responsible_id?: string
          status?: Database["public"]["Enums"]["nc_status"]
          target_date?: string
          updated_at?: string
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corrective_actions_nc_id_fkey"
            columns: ["nc_id"]
            isOneToOne: false
            referencedRelation: "non_conformities"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          category: string
          content: string | null
          created_at: string
          created_by: string
          description: string | null
          document_number: string
          file_url: string | null
          id: string
          next_review_date: string | null
          review_date: string | null
          status: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          category: string
          content?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          document_number: string
          file_url?: string | null
          id?: string
          next_review_date?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          category?: string
          content?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          document_number?: string
          file_url?: string | null
          id?: string
          next_review_date?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      kpi_values: {
        Row: {
          actual_value: number
          created_at: string
          id: string
          kpi_id: string
          notes: string | null
          period_date: string
          recorded_by: string
          target_value: number | null
        }
        Insert: {
          actual_value: number
          created_at?: string
          id?: string
          kpi_id: string
          notes?: string | null
          period_date: string
          recorded_by: string
          target_value?: number | null
        }
        Update: {
          actual_value?: number
          created_at?: string
          id?: string
          kpi_id?: string
          notes?: string | null
          period_date?: string
          recorded_by?: string
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_values_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          code: string
          created_at: string
          description: string | null
          frequency: string
          id: string
          name: string
          owner_id: string
          process_id: string | null
          target_operator: string | null
          target_value: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          frequency: string
          id?: string
          name: string
          owner_id: string
          process_id?: string | null
          target_operator?: string | null
          target_value?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          frequency?: string
          id?: string
          name?: string
          owner_id?: string
          process_id?: string | null
          target_operator?: string | null
          target_value?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpis_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformities: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          created_at: string
          description: string
          detected_by: string
          detected_date: string
          id: string
          immediate_action: string | null
          nc_number: string
          process_id: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["nc_severity"]
          source: string | null
          status: Database["public"]["Enums"]["nc_status"]
          target_close_date: string | null
          title: string
          updated_at: string
          verification_date: string | null
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          created_at?: string
          description: string
          detected_by: string
          detected_date: string
          id?: string
          immediate_action?: string | null
          nc_number: string
          process_id?: string | null
          root_cause?: string | null
          severity: Database["public"]["Enums"]["nc_severity"]
          source?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          target_close_date?: string | null
          title: string
          updated_at?: string
          verification_date?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string
          detected_by?: string
          detected_date?: string
          id?: string
          immediate_action?: string | null
          nc_number?: string
          process_id?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["nc_severity"]
          source?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          target_close_date?: string | null
          title?: string
          updated_at?: string
          verification_date?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "non_conformities_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          inputs: string | null
          kpis: string | null
          name: string
          objectives: string | null
          outputs: string | null
          owner_id: string
          resources: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          inputs?: string | null
          kpis?: string | null
          name: string
          objectives?: string | null
          outputs?: string | null
          owner_id: string
          resources?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          inputs?: string | null
          kpis?: string | null
          name?: string
          objectives?: string | null
          outputs?: string | null
          owner_id?: string
          resources?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      risks: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          impact: number | null
          mitigation_plan: string | null
          owner_id: string
          probability: number | null
          process_id: string | null
          review_date: string | null
          risk_level: number | null
          risk_number: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: string
          impact?: number | null
          mitigation_plan?: string | null
          owner_id: string
          probability?: number | null
          process_id?: string | null
          review_date?: string | null
          risk_level?: number | null
          risk_number: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          impact?: number | null
          mitigation_plan?: string | null
          owner_id?: string
          probability?: number | null
          process_id?: string | null
          review_date?: string | null
          risk_level?: number | null
          risk_number?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_attendance: {
        Row: {
          attended: boolean | null
          certificate_issued: boolean | null
          created_at: string
          id: string
          notes: string | null
          score: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          code: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          objectives: string | null
          target_audience: string | null
          title: string
          trainer: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          objectives?: string | null
          target_audience?: string | null
          title: string
          trainer?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          objectives?: string | null
          target_audience?: string | null
          title?: string
          trainer?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          created_at: string
          id: string
          location: string | null
          max_participants: number | null
          notes: string | null
          program_id: string
          session_date: string
          status: string
          trainer: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          notes?: string | null
          program_id: string
          session_date: string
          status?: string
          trainer?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          notes?: string | null
          program_id?: string
          session_date?: string
          status?: string
          trainer?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "quality_manager" | "auditor" | "user"
      audit_status: "planned" | "in_progress" | "completed" | "cancelled"
      audit_type: "internal" | "external" | "certification" | "surveillance"
      document_status: "draft" | "under_review" | "approved" | "obsolete"
      nc_severity: "minor" | "major" | "critical"
      nc_status: "open" | "in_progress" | "resolved" | "closed" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "quality_manager", "auditor", "user"],
      audit_status: ["planned", "in_progress", "completed", "cancelled"],
      audit_type: ["internal", "external", "certification", "surveillance"],
      document_status: ["draft", "under_review", "approved", "obsolete"],
      nc_severity: ["minor", "major", "critical"],
      nc_status: ["open", "in_progress", "resolved", "closed", "rejected"],
    },
  },
} as const
