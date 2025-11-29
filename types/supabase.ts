export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          id: string
          participant_id: string
          question_id: string
          selected_option: string
          is_correct: boolean
          submitted_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          question_id: string
          selected_option: string
          is_correct: boolean
          submitted_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          question_id?: string
          selected_option?: string
          is_correct?: boolean
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      participants: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          username: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          username?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          username?: string | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          id: string
          room_id: string
          question_text: string
          options: Json
          correct_answer: string
          order: number
        }
        Insert: {
          id?: string
          room_id: string
          question_text: string
          options: Json
          correct_answer: string
          order: number
        }
        Update: {
          id?: string
          room_id?: string
          question_text?: string
          options?: Json
          correct_answer?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      rooms: {
        Row: {
          id: string
          code: string
          host_id: string
          title: string
          settings: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          host_id: string
          title: string
          settings?: Json
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          host_id?: string
          title?: string
          settings?: Json
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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