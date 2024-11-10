import { createClient } from "@supabase/supabase-js";
import { Player, Team } from "../types";
import { usePlayers } from "./usePlayers";
import { useStatistics } from "./useStatistics";
import { useTeams } from "./useTeams";
import { useUsers } from "./useUsers";



const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;

const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncXlpc2FkcmxseW1yZGdybHRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDczMzAwNSwiZXhwIjoyMDQ2MzA5MDA1fQ.jkYssNyNT9ScPk-WEcPQNrMpyIGfiyOQfg8Vb1tKtnw", {
    auth: {
        detectSessionInUrl: false,
    }
})

export const useUserManagement = () => {
  const { createUser } = useUsers();
  const { createPlayer } = usePlayers();
  const { createTeam } = useTeams();
  const { createStatistics } = useStatistics();

  const createUserWithRole = async (userData: {
    email: string;
    password: string;
    role: 'player' | 'team';
    playerData?: Partial<Player>;
    teamData?: Partial<Team>;
  }) => {
    try {
      // 1. Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

      if (authError) throw authError;

      const newUser = await createUser({
        email: userData.email,
        role: userData.role,
        user_id: authData.user?.id,
      });

      if (!newUser) throw new Error('Failed to create user');

      // 3. Create additional entity based on role
      if (userData.role === 'player' && userData.playerData) {
        const newPlayer = await createPlayer({
          ...userData.playerData,
          user_id: newUser.id,
        });

        if (!newPlayer) throw new Error('Failed to create player');

        // 4. Create initial statistics for the player
        await createStatistics({
          player: newPlayer.id,
          goals: 0,
          assistances: 0,
          yellow_cards: 0,
          red_cards: 0,
        });
      } else if (userData.role === 'team' && userData.teamData) {
        await createTeam({
          ...userData.teamData,
          team_id: newUser.id,
        });
      }

      return newUser;
    } catch (error) {
      console.error('Error in createUserWithRole:', error);
      throw error;
    }
  };

  return { createUserWithRole };
};