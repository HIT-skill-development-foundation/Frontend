import { createSlice } from '@reduxjs/toolkit';

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    items: [],
    selectedCategory: 'all',
    isLoading: false,
  },
  reducers: {
    setGalleryItems: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
    },
    setGalleryCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addGalleryItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteGalleryItem: (state, action) => {
      state.items = state.items.filter((item) => (item.id || item._id) !== action.payload);
    },
    setGalleryLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setGalleryItems,
  setGalleryCategory,
  addGalleryItem,
  deleteGalleryItem,
  setGalleryLoading,
} = gallerySlice.actions;

export const selectGalleryItems = (state) => state.gallery.items;
export const selectGalleryCategory = (state) => state.gallery.selectedCategory;
export const selectIsGalleryLoading = (state) => state.gallery.isLoading;

export default gallerySlice.reducer;
