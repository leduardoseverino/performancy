import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface AuthState {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: GoogleUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Fake Google users for demo
const FAKE_GOOGLE_USERS: GoogleUser[] = [
  {
    id: '1',
    email: 'thais.cano@skyone.com',
    name: 'Thais Rui Cano',
    picture: 'https://ui-avatars.com/api/?name=Thais+Cano&background=f97316&color=fff&size=128',
    given_name: 'Thais',
    family_name: 'Cano',
  },
  {
    id: '2',
    email: 'carlos.silva@empresa.com.br',
    name: 'Carlos Silva',
    picture: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=3b82f6&color=fff&size=128',
    given_name: 'Carlos',
    family_name: 'Silva',
  },
  {
    id: '3',
    email: 'ana.costa@empresa.com.br',
    name: 'Ana Costa',
    picture: 'https://ui-avatars.com/api/?name=Ana+Costa&background=22c55e&color=fff&size=128',
    given_name: 'Ana',
    family_name: 'Costa',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'performancy-auth',
    }
  )
);

// Simulate Google OAuth flow
export const simulateGoogleLogin = (): Promise<GoogleUser> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Return a random fake user or the first one
      const randomUser = FAKE_GOOGLE_USERS[Math.floor(Math.random() * FAKE_GOOGLE_USERS.length)];
      resolve(randomUser);
    }, 1500);
  });
};

export const simulateGoogleLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

