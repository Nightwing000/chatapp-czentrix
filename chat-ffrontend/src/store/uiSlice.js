import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    unreadCount: {},         // visitorId -> count
    highlightedMessages: [], // message IDs
    modals: {
      chatDetails: false,
    },
  },
  reducers: {
    incrementUnread(state, action) {
      const id = action.payload;
      state.unreadCount[id] = (state.unreadCount[id] || 0) + 1;
    },
    clearUnread(state, action) {
      delete state.unreadCount[action.payload];
    },
    highlightMessage(state, action) {
      state.highlightedMessages.push(action.payload);
    },
    clearHighlights(state) {
      state.highlightedMessages = [];
    },
    toggleChatDetailsModal(state, action) {
      state.modals.chatDetails = action.payload;
    }
  }
});

export const {
  incrementUnread,
  clearUnread,
  highlightMessage,
  clearHighlights,
  toggleChatDetailsModal
} = uiSlice.actions;
export default uiSlice.reducer;
