import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Equipo, Jugador, Partido, Usuario } from '../types';

const SUPABASE_URL = 'https://hgqyisadrllymrdgrltm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncXlpc2FkcmxseW1yZGdybHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzMwMDUsImV4cCI6MjA0NjMwOTAwNX0.ayFrR1b2xMM0HTGZjzZwlG6eQJ9HlbMqVSSff9s4BRs';

class SupabaseService {
  private static instance: SupabaseService;
  private supabaseClient: SupabaseClient;

  private constructor() {
    this.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }

  public async createEquipo(equipo: Equipo): Promise<void> {
    const { error } = await this.supabaseClient.from('equipos').insert(equipo);
    if (error) {
      console.error('Error al crear el equipo:', error);
      throw error;
    }
  }

  public async createJugador(jugador: Jugador): Promise<void> {
    const { error } = await this.supabaseClient.from('jugadores').insert(jugador);
    if (error) {
      console.error('Error al crear el jugador:', error);
      throw error;
    }
  }

  public async createPartido(partido: Partido): Promise<void> {
    const { error } = await this.supabaseClient.from('partidos').insert(partido);
    if (error) {
      console.error('Error al crear el partido:', error);
      throw error;
    }
  }

  public async createUsuario(usuario: Usuario): Promise<void> {
    const { error } = await this.supabaseClient.from('usuarios').insert(usuario);
    if (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }
}

export default SupabaseService;