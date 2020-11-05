import React from 'react';

import { NotificationContext } from '../context/NotificationContext';

export const ConsigneeNotificationProvider = ({ children }) => {
  const notificationCount = 0;

  return (
    <NotificationContext.Provider
      value={{
        notificationCount: notificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
