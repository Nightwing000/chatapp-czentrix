import { createSlice } from '@reduxjs/toolkit';

const visitorsSlice = createSlice({
  name: 'visitors',
  initialState: {
    list: [],           
    selectedId: null,   
  },
  reducers: {
    setVisitors(state, action) {
      state.list = action.payload;
    },
    addVisitor(state, action) {
      state.list.push(action.payload);
    },
    selectVisitor(state, action) {
      state.selectedId = action.payload;
    }
  }
});

export const { setVisitors, addVisitor, selectVisitor } = visitorsSlice.actions;
export default visitorsSlice.reducer;
