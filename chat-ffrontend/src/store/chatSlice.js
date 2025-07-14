import { createSlice } from '@reduxjs/toolkit';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    messagesByVisitor: {},
    visitorMetadata: {},
  },
  reducers: {
    addMessage(state, action) {
      const { visitorId, message, selectedId } = action.payload;
      if (!state.messagesByVisitor[visitorId]) {
        state.messagesByVisitor[visitorId] = [];
      }
      const previousCount = state.visitorMetadata[visitorId]?.unreadCount || 0;

      state.messagesByVisitor[visitorId].push(message);
      state.visitorMetadata[visitorId] = {
          ...(state.visitorMetadata[visitorId] || {}),
      lastMessageTime: message.timestamp || Date.now(),

      unreadCount: (visitorId === selectedId) ? 0 : previousCount + 1,

      lastMessageSnippet: message.text || "",


  };
},  
    setMessages(state, action) {
      const { visitorId, messages } = action.payload;
      state.messagesByVisitor[visitorId] = messages;
    },

    markvisitorAsRead(state, action) {
      const { visitorId } = action.payload;
      if (state.visitorMetadata[visitorId]) {
        state.visitorMetadata[visitorId].unreadCount = 0;
      }
    }
  }
});

export const { addMessage, setMessages, markvisitorAsRead } = chatsSlice.actions;
export default chatsSlice.reducer;
