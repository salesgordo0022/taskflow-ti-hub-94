export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          cnpj: string
          created_at: string | null
          email: string
          has_apuracao: boolean | null
          has_cupom: boolean | null
          has_envio_documentos: boolean | null
          has_nota_entrada: boolean | null
          has_nota_saida: boolean | null
          id: string
          is_automated: boolean | null
          level: string
          name: string
          phone: string
          regime: string
          responsible: string
          responsible_person: string
          segment: string
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          email: string
          has_apuracao?: boolean | null
          has_cupom?: boolean | null
          has_envio_documentos?: boolean | null
          has_nota_entrada?: boolean | null
          has_nota_saida?: boolean | null
          id?: string
          is_automated?: boolean | null
          level: string
          name: string
          phone: string
          regime: string
          responsible: string
          responsible_person: string
          segment: string
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          email?: string
          has_apuracao?: boolean | null
          has_cupom?: boolean | null
          has_envio_documentos?: boolean | null
          has_nota_entrada?: boolean | null
          has_nota_saida?: boolean | null
          id?: string
          is_automated?: boolean | null
          level?: string
          name?: string
          phone?: string
          regime?: string
          responsible?: string
          responsible_person?: string
          segment?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      incident_notes: {
        Row: {
          created_at: string | null
          id: string
          incident_id: string | null
          note: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          incident_id?: string | null
          note: string
        }
        Update: {
          created_at?: string | null
          id?: string
          incident_id?: string | null
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_notes_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_systems: {
        Row: {
          created_at: string | null
          id: string
          incident_id: string | null
          system_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          incident_id?: string | null
          system_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          incident_id?: string | null
          system_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_systems_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_systems_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          resolved_at?: string | null
          severity: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          task_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          task_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          task_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      system_companies: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          system_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          system_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          system_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_companies_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      system_tags: {
        Row: {
          created_at: string | null
          id: string
          system_id: string | null
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          system_id?: string | null
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          system_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_tags_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      system_users: {
        Row: {
          created_at: string | null
          id: string
          system_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          system_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          system_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_users_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      systems: {
        Row: {
          actual_end_date: string | null
          created_at: string | null
          description: string | null
          expected_end_date: string
          id: string
          is_implemented: boolean | null
          name: string
          progress: number | null
          responsible: string
          start_date: string
          status: string
          system_url: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          actual_end_date?: string | null
          created_at?: string | null
          description?: string | null
          expected_end_date: string
          id?: string
          is_implemented?: boolean | null
          name: string
          progress?: number | null
          responsible: string
          start_date: string
          status: string
          system_url?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          actual_end_date?: string | null
          created_at?: string | null
          description?: string | null
          expected_end_date?: string
          id?: string
          is_implemented?: boolean | null
          name?: string
          progress?: number | null
          responsible?: string
          start_date?: string
          status?: string
          system_url?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      task_reminder_channels: {
        Row: {
          channel: string
          created_at: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_reminder_channels_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          reminder_enabled: boolean | null
          responsible: string
          status: string
          system_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority: string
          reminder_enabled?: boolean | null
          responsible: string
          status: string
          system_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          reminder_enabled?: boolean | null
          responsible?: string
          status?: string
          system_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
