import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    filteredProducts: [],
    isSearching: false,
    searchHistory: [],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        if (state.searchHistory.length > 10) {
          state.searchHistory.pop();
        }
      }
    },
    
    clearSearch: (state) => {
      state.query = '';
      state.filteredProducts = [];
      state.isSearching = false;
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
  },
});

export const { 
  setSearchQuery, 
  setFilteredProducts, 
  setIsSearching, 
  addToSearchHistory, 
  clearSearch, 
  clearSearchHistory 
} = searchSlice.actions;

export default searchSlice.reducer;
