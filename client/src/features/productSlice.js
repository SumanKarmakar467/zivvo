import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({ name: "product", initialState: { filters: {}, selected: null }, reducers: { setFilters: (s, a) => { s.filters = a.payload; }, setSelectedProduct: (s, a) => { s.selected = a.payload; } } });
export const { setFilters, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
