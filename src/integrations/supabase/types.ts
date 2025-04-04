export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          participants: string[]
          property_id: string | null
          subject: string | null
          unread_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participants: string[]
          property_id?: string | null
          subject?: string | null
          unread_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participants?: string[]
          property_id?: string | null
          subject?: string | null
          unread_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          path: string
          property_id: string
          size: number
          type: string
          updated_at: string | null
          uploaded_by: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          path: string
          property_id: string
          size: number
          type: string
          updated_at?: string | null
          uploaded_by: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          path?: string
          property_id?: string
          size?: number
          type?: string
          updated_at?: string | null
          uploaded_by?: string
          url?: string
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          address: Json
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          documents: Json[] | null
          energy_efficient: boolean | null
          features: string[] | null
          fees: string | null
          id: string
          images: string[] | null
          parking_details: string | null
          price: number
          property_condition: string | null
          property_type: string
          recent_upgrades: string | null
          seller_email: string | null
          seller_id: string
          seller_name: string | null
          special_amenities: string | null
          square_feet: number | null
          status: string | null
          title: string
          updated_at: string | null
          utility_information: string | null
          year_built: number | null
        }
        Insert: {
          address: Json
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          documents?: Json[] | null
          energy_efficient?: boolean | null
          features?: string[] | null
          fees?: string | null
          id?: string
          images?: string[] | null
          parking_details?: string | null
          price: number
          property_condition?: string | null
          property_type: string
          recent_upgrades?: string | null
          seller_email?: string | null
          seller_id: string
          seller_name?: string | null
          special_amenities?: string | null
          square_feet?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          utility_information?: string | null
          year_built?: number | null
        }
        Update: {
          address?: Json
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          documents?: Json[] | null
          energy_efficient?: boolean | null
          features?: string[] | null
          fees?: string | null
          id?: string
          images?: string[] | null
          parking_details?: string | null
          price?: number
          property_condition?: string | null
          property_type?: string
          recent_upgrades?: string | null
          seller_email?: string | null
          seller_id?: string
          seller_name?: string | null
          special_amenities?: string | null
          square_feet?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          utility_information?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      property_open_houses: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          property_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          property_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          property_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_open_houses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          is_primary: boolean
          property_id: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_primary?: boolean
          property_id?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_primary?: boolean
          property_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      property_viewings: {
        Row: {
          buyer_id: string
          buyer_notes: string | null
          created_at: string | null
          id: string
          is_virtual: boolean | null
          meeting_link: string | null
          property_id: string
          requested_date: string
          requested_time_end: string
          requested_time_start: string
          seller_id: string
          seller_notes: string | null
          status: Database["public"]["Enums"]["viewing_request_status"]
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          buyer_notes?: string | null
          created_at?: string | null
          id?: string
          is_virtual?: boolean | null
          meeting_link?: string | null
          property_id: string
          requested_date: string
          requested_time_end: string
          requested_time_start: string
          seller_id: string
          seller_notes?: string | null
          status?: Database["public"]["Enums"]["viewing_request_status"]
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          buyer_notes?: string | null
          created_at?: string | null
          id?: string
          is_virtual?: boolean | null
          meeting_link?: string | null
          property_id?: string
          requested_date?: string
          requested_time_end?: string
          requested_time_start?: string
          seller_id?: string
          seller_notes?: string | null
          status?: Database["public"]["Enums"]["viewing_request_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          is_recurring: boolean | null
          property_id: string
          seller_id: string
          specific_date: string | null
          time_end: string
          time_start: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          is_recurring?: boolean | null
          property_id: string
          seller_id: string
          specific_date?: string | null
          time_end: string
          time_start: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_recurring?: boolean | null
          property_id?: string
          seller_id?: string
          specific_date?: string | null
          time_end?: string
          time_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
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
      viewing_request_status:
        | "PENDING"
        | "APPROVED"
        | "REJECTED"
        | "CANCELED"
        | "COMPLETED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
