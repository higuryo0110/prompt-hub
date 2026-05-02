export type Genre = {
  id: number
  slug: string
  name: string
  icon: string
  color: string
}

export type Profile = {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export type Prompt = {
  id: string
  user_id: string
  genre_id: number
  title: string
  description: string | null
  content: string
  ai_model: string | null
  is_public: boolean
  copy_count: number
  created_at: string
  updated_at: string
}

export type PromptWithDetails = Prompt & {
  genre: Genre
  profile: Profile
  favorite_count: number
  is_favorited?: boolean
  tag_names: string[] | null
}

export type Tag = {
  id: number
  name: string
}
