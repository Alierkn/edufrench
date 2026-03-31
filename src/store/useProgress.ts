import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  grade: string;
  school: string;
  source: string;
}

interface ProgressState {
  completedModules: string[];
  totalScore: number;
  weaknesses: string[];
  userInfo: UserInfo | null;
  addCompleted: (moduleId: string, score: number) => void;
  addWeakness: (tag: string) => void;
  removeWeakness: (tag: string) => void;
  setUserInfo: (info: UserInfo) => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedModules: [],
      totalScore: 0,
      weaknesses: [], // Onboarding üzerinden beslenecek
      userInfo: null, // Onboarding üzerinden beslenecek

      addCompleted: (moduleId, score) => set((state) => ({
        completedModules: state.completedModules.includes(moduleId) 
          ? state.completedModules 
          : [...state.completedModules, moduleId],
        totalScore: state.totalScore + score
      })),
      
      addWeakness: (tag) => set((state) => {
        // Zaten varsa eklemiyoruz, boşsa override ediyoruz veya yana pushluyoruz.
        return {
          weaknesses: state.weaknesses.includes(tag) ? state.weaknesses : [tag, ...state.weaknesses]
        };
      }),

      removeWeakness: (tag) => set((state) => ({
        weaknesses: state.weaknesses.filter((w) => w !== tag)
      })),

      setUserInfo: (info) => set(() => ({
        userInfo: info
      }))
    }),
    {
      name: 'edu-francais-progress-store', // LocalStorage Key
    }
  )
);
