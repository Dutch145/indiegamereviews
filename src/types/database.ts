export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      developer_spotlight: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          developer_name: string
          game_title: string
          id: string
          is_featured: boolean
          status: string | null
          store_link: string | null
          twitter_handle: string | null
          twitter_post_url: string | null
          user_id: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          developer_name: string
          game_title: string
          id?: string
          is_featured?: boolean
          status?: string | null
          store_link?: string | null
          twitter_handle?: string | null
          twitter_post_url?: string | null
          user_id?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string
          game_title?: string
          id?: string
          is_featured?: boolean
          status?: string | null
          store_link?: string | null
          twitter_handle?: string | null
          twitter_post_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      community_reviews: {
        Row: {
          body: string
          cons: string[] | null
          created_at: string
          game_id: string
          id: string
          pros: string[] | null
          review_type: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          cons?: string[] | null
          created_at?: string
          game_id: string
          id?: string
          pros?: string[] | null
          review_type?: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          cons?: string[] | null
          created_at?: string
          game_id?: string
          id?: string
          pros?: string[] | null
          review_type?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      editor_reviews: {
        Row: {
          author: string
          game_id: string
          id: string
          published_at: string
          score_audio: number | null
          score_gameplay: number | null
          score_overall: number
          score_replayability: number | null
          score_visuals: number | null
          summary: string
          updated_at: string
          verdict: string
        }
        Insert: {
          author: string
          game_id: string
          id?: string
          published_at?: string
          score_audio?: number | null
          score_gameplay?: number | null
          score_overall: number
          score_replayability?: number | null
          score_visuals?: number | null
          summary: string
          updated_at?: string
          verdict: string
        }
        Update: {
          author?: string
          game_id?: string
          id?: string
          published_at?: string
          score_audio?: number | null
          score_gameplay?: number | null
          score_overall?: number
          score_replayability?: number | null
          score_visuals?: number | null
          summary?: string
          updated_at?: string
          verdict?: string
        }
        Relationships: []
      }
      flagged_reviews: {
        Row: {
          created_at: string
          flagged_by: string
          id: string
          reason: string | null
          resolved: boolean
          review_id: string
        }
        Insert: {
          created_at?: string
          flagged_by: string
          id?: string
          reason?: string | null
          resolved?: boolean
          review_id: string
        }
        Update: {
          created_at?: string
          flagged_by?: string
          id?: string
          reason?: string | null
          resolved?: boolean
          review_id?: string
        }
        Relationships: []
      }
      game_requests: {
        Row: {
          id: string
          title: string
          user_id: string
          votes: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          user_id: string
          votes?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          user_id?: string
          votes?: number
          created_at?: string
        }
        Relationships: []
      }
      game_request_votes: {
        Row: {
          id: string
          request_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      game_wishlists: {
        Row:    { id: string; user_id: string; game_id: string; created_at: string }
        Insert: { id?: string; user_id: string; game_id: string; created_at?: string }
        Update: { id?: string; user_id?: string; game_id?: string; created_at?: string }
        Relationships: []
      }
      games: {
        Row: {
          banner_url: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          developer: string
          editor_pick_label: string | null
          genres: string[] | null
          id: string
          is_featured: boolean
          is_spotlight: boolean
          platforms: string[] | null
          publisher: string | null
          release_year: number | null
          slug: string
          spotlight_quote: string | null
          store_link: string | null
          title: string
        }
        Insert: {
          banner_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          developer: string
          editor_pick_label?: string | null
          genres?: string[] | null
          id?: string
          is_featured?: boolean
          is_spotlight?: boolean
          platforms?: string[] | null
          publisher?: string | null
          release_year?: number | null
          slug: string
          spotlight_quote?: string | null
          store_link?: string | null
          title: string
        }
        Update: {
          banner_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          developer?: string
          editor_pick_label?: string | null
          genres?: string[] | null
          id?: string
          is_featured?: boolean
          is_spotlight?: boolean
          platforms?: string[] | null
          publisher?: string | null
          release_year?: number | null
          slug?: string
          spotlight_quote?: string | null
          store_link?: string | null
          title?: string
        }
        Relationships: []
      }
      helpful_votes: {
        Row: {
          created_at: string
          helpful: boolean
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful: boolean
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful?: boolean
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean
          is_reviewer: boolean
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean
          is_reviewer?: boolean
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean
          is_reviewer?: boolean
          username?: string
        }
        Relationships: []
      }
      review_comments: {
        Row:    { id: string; review_id: string; user_id: string; username: string; body: string; created_at: string }
        Insert: { id?: string; review_id: string; user_id: string; username: string; body: string; created_at?: string }
        Update: { id?: string; review_id?: string; user_id?: string; username?: string; body?: string; created_at?: string }
        Relationships: []
      }
      review_drafts: {
        Row: {
          id: string
          game_id: string
          author_id: string
          author_name: string
          summary: string
          verdict: string
          score_overall: number
          score_gameplay: number | null
          score_visuals: number | null
          score_replayability: number | null
          score_audio: number | null
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          author_id: string
          author_name: string
          summary: string
          verdict: string
          score_overall: number
          score_gameplay?: number | null
          score_visuals?: number | null
          score_replayability?: number | null
          score_audio?: number | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          author_id?: string
          author_name?: string
          summary?: string
          verdict?: string
          score_overall?: number
          score_gameplay?: number | null
          score_visuals?: number | null
          score_replayability?: number | null
          score_audio?: number | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_reviews_with_votes: {
        Row: {
          avatar_url: string | null
          body: string | null
          cons: string[] | null
          created_at: string | null
          game_id: string | null
          helpful_no: number | null
          helpful_yes: number | null
          id: string | null
          pros: string[] | null
          review_type: string | null
          score: number | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Game = Database["public"]["Tables"]["games"]["Row"]
export type EditorReview = Database["public"]["Tables"]["editor_reviews"]["Row"]
export type CommunityReview = Database["public"]["Tables"]["community_reviews"]["Row"]
export type FlaggedReview = Database["public"]["Tables"]["flagged_reviews"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type GameRequest = Database["public"]["Tables"]["game_requests"]["Row"]
export type GameRequestVote = Database["public"]["Tables"]["game_request_votes"]["Row"]
export type ReviewDraft = Database["public"]["Tables"]["review_drafts"]["Row"]
export type CommunityReviewWithVotes = Database["public"]["Views"]["community_reviews_with_votes"]["Row"]
export type DeveloperSpotlight = Database["public"]["Tables"]["developer_spotlight"]["Row"]