import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socket from '../socket';
import { addMessage } from '../store/chatSlice';
import { addVisitor } from '../store/visitorslice';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    socket.on('new_visitor', (visitor) => {
      dispatch(addVisitor(visitor));
    });

    socket.on('visitor message', (data) => {
      dispatch(addMessage({ 
        visitorId: data.visitorId, 
        message: data 
      }));
    });

    socket.on('agent_message', (data) => {
      dispatch(addMessage({ 
        visitorId: data.visitorId, 
        message: data 
      }));
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection failed:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('new_visitor');
      socket.off('visitor message');
      socket.off('agent_message');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
