import {configureStore} from '@reduxjs/toolkit';
import visitorReducer from './visitorslice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        visitors: visitorReducer,
        chats: chatReducer,
        ui: uiReducer,
    },
})