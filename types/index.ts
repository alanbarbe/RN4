export type UserRole = 'admin' | 'player' | 'follower';

export interface Team {
  id: number;
  name: string;
  team_shield: string;
  team_id: string; 
}

export interface Player {
  id: number;
  name: string;
  surname: string;
  age: number;
  position: string;
  jersey_number: number;
  team: number;
  created_at: string;
  user_id: string;
  image: string;
}

export interface Match {
  id: number;
  local_team: number;
  away_team: number;
  local_team_goals: number;
  away_team_goals: number;
  stadium: string;
  date: string;
  created_at: string;
}

export interface Statistics {
  id: number;
  player: number;
  goals: number;
  assistances: number;
  yellow_cards: number;
  red_cards: number;
  created_at: string;
}

export interface User {
    id: number;
    user_id: string;
    email: string;
    role: string;
}