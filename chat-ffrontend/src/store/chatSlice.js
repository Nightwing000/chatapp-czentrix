import { createSlice } from '@reduxjs/toolkit';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    messagesByVisitor: {} // visitorId -> messages[]
  },
  reducers: {
    addMessage(state, action) {
      const { visitorId, message } = action.payload;
      if (!state.messagesByVisitor[visitorId]) {
        state.messagesByVisitor[visitorId] = [];
      }
      state.messagesByVisitor[visitorId].push(message);
    },
    setMessages(state, action) {
      const { visitorId, messages } = action.payload;
      state.messagesByVisitor[visitorId] = messages;
    }
  }
});

export const { addMessage, setMessages } = chatsSlice.actions;
export default chatsSlice.reducer;
