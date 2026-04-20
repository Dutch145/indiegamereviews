export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          slug: string;
          title: string;
          developer: string;
          publisher: string | null;
          release_year: number | null;
          genres: string[];
          platforms: string[];
          cover_url: string | null;
          banner_url: string | null;
          description: string | null;
          is_featured: boolean;
          is_spotlight: boolean;
          spotlight_quote: string | null;
          editor_pick_label: string | null;
          created_at: string;
        };
        Insert: Omit
          Database["public"]["Tables"]["games"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      editor_reviews: {
        Row: {
          id: string;
          game_id: string;
          author: string;
          summary: string;
          verdict: string;
          score_overall: number;
          score_gameplay: number | null;
          score_visuals: number | null;
          score_replayability: number | null;
          score_audio: number | null;
          published_at: string;
          updated_at: string;
        };
        Insert: Omit
          Database["public"]["Tables"]["editor_reviews"]["Row"],
          "id" | "published_at" | "updated_at"
        >;
        Update: Partial
          Database["public"]["Tables"]["editor_reviews"]["Insert"]
        >;
      };
      community_reviews: {
        Row: {
          id: string;
          game_id: string;
          user_id: string;
          score: number;
          body: string;
          review_type: string;
          pros: string[];
          cons: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit
          Database["public"]["Tables"]["community_reviews"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial
          Database["public"]["Tables"]["community_reviews"]["Insert"]
        >;
      };
      helpful_votes: {
        Row: {
          id: string;
          review_id: string;
          user_id: string;
          helpful: boolean;
          created_at: string;
        };
        Insert: Omit
          Database["public"]["Tables"]["helpful_votes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial
          Database["public"]["Tables"]["helpful_votes"]["Insert"]
        >;
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
    };
    Views: {
      community_reviews_with_votes: {
        Row: Database["public"]["Tables"]["community_reviews"]["Row"] & {
          username: string;
          avatar_url: string | null;
          helpful_yes: number;
          helpful_no: number;
        };
      };
    };
  };
}

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type EditorReview =
  Database["public"]["Tables"]["editor_reviews"]["Row"];
export type CommunityReview =
  Database["public"]["Tables"]["community_reviews"]["Row"];
export type CommunityReviewWithVotes =
  Database["public"]["Views"]["community_reviews_with_votes"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];