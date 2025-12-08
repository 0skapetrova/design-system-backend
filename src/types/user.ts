export type TUserDB = {
  id: string;
  username: string;
  phone: string;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  password_hash: string;
  phone_verified_at: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TUserPublic = {
  id: string;
  username: string;
  phone: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};
