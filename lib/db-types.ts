export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          created_at: string | null;
          updated_at: string | null;
          status: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: string | null;
          metadata?: Json | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          role_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          role_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          role_id?: string;
          created_at?: string | null;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          account_id: string;
          plan: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          account_id: string;
          plan: string;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string;
          plan?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      ai_runs: {
        Row: {
          id: string;
          account_id: string | null;
          model: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          total_cost: number | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_cost?: number | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string | null;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_cost?: number | null;
          status?: string | null;
          created_at?: string | null;
        };
      };
      ai_run_usage: {
        Row: {
          id: string;
          ai_run_id: string;
          model: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          total_cost: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          ai_run_id: string;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_cost?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          ai_run_id?: string;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_cost?: number | null;
          created_at?: string | null;
        };
      };
      platform_cost_ledger: {
        Row: {
          id: string;
          account_id: string | null;
          ai_run_id: string | null;
          amount: number | null;
          currency: string | null;
          type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          ai_run_id?: string | null;
          amount?: number | null;
          currency?: string | null;
          type?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string | null;
          ai_run_id?: string | null;
          amount?: number | null;
          currency?: string | null;
          type?: string | null;
          created_at?: string | null;
        };
      };
      audit_events: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string | null;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          action?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
      };
      license_integrity_events: {
        Row: {
          id: string;
          account_id: string | null;
          event_type: string | null;
          severity: string | null;
          details: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          account_id?: string | null;
          event_type?: string | null;
          severity?: string | null;
          details?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string | null;
          event_type?: string | null;
          severity?: string | null;
          details?: Json | null;
          created_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
