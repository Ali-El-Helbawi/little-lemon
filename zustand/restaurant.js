const menuUrl = `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json`;

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const createMenuSlice = (set, get) => ({
  menuItems: [],
  categories: [],
  getMenuItems: async () => {
    const menuItems = get().menuItems;
    console.log(`menuItems.length`);
    console.log(menuItems.length);

    if (menuItems.length >= 0) {
      //return;
    }
    await axios
      .get(menuUrl)
      .then(resp => {
        const menuData = resp?.data?.menu ?? [];
        let arr = [];
        // const categoriesArr = new Set();
        let categoriesArr = [];
        menuData.map(item => {
          const category = item?.category ?? '';
          const imageUrl = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
          categoriesArr.push(category);
          const newItem = {...item, imageUrl: imageUrl};
          arr.push(newItem);
        });
        console.log(arr);
        const uniqueCategories = [...new Set(categoriesArr)];
        console.log(uniqueCategories);
        set(state => {
          console.log('state');
          console.log(state);
          return {
            menuItems: arr,
            categories: uniqueCategories,
          };
        });
      })
      .catch(err => {
        console.error(err?.message ?? err);
      });
  },
});

export const useRestaurantStore = create(
  persist(
    (...a) => ({
      ...createMenuSlice(...a),
    }),
    {
      name: 'restaurant-store',
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => state => {},
    },
  ),
);
