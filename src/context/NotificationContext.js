import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newNotification = { id, message, type, show: true };
    
    setNotifications(prev => [...prev, newNotification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    addNotification(message, 'warning', duration);
  }, [addNotification]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FaCheckCircle className="me-2" />;
      case 'error': return <FaTimesCircle className="me-2" />;
      case 'warning': return <FaExclamationCircle className="me-2" />;
      case 'info': return <FaInfoCircle className="me-2" />;
      default: return null;
    }
  };

  const getVariant = (type) => {
    switch(type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
      <ToastContainer 
        position="top-end" 
        className="p-3" 
        style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999 }}
      >
        {notifications.map((notif) => (
          <Toast
            key={notif.id}
            show={notif.show}
            onClose={() => removeNotification(notif.id)}
            bg={getVariant(notif.type)}
            delay={5000}
            autohide
          >
            <Toast.Header closeButton>
              <strong className="me-auto d-flex align-items-center">
                {getIcon(notif.type)}
                {notif.type === 'success' && 'Éxito'}
                {notif.type === 'error' && 'Error'}
                {notif.type === 'warning' && 'Advertencia'}
                {notif.type === 'info' && 'Información'}
              </strong>
            </Toast.Header>
            <Toast.Body className={notif.type === 'error' || notif.type === 'warning' ? 'text-white' : ''}>
              {notif.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};
