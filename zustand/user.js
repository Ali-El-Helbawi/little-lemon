import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const createUserSlice = (set, get) => ({
  user: null,
  isLoggedIn: false,
  logIn: newUser => set(state => ({user: newUser, isLoggedIn: true})),
  updateUser: newUser => set(state => ({user: {...get().user, ...newUser}})),
  logOut: () => set(state => ({user: null, isLoggedIn: false})),
});

export const useUserStore = create(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => {},
    },
  ),
);
