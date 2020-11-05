import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import useSocket from '../hooks/useSocket';

import { UserContext } from './UserContext';

import { NOTIFICATIONS_LIMIT } from '../utils/constants.js';

import { notification, message } from 'antd';

import Icon from '../components/ui/Icon';

import NotificationTitle from '../components/notifications/NotificationTitle';
import NotificationSentBy from '../components/notifications/NotificationSentBy';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { apiCall, namespace, portName, user } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const notificationCount = 0;

  const { loading, data, error, fetchData } = useApi('get', `notifications/${NOTIFICATIONS_LIMIT}`, {});

  if (error) {
    message.error(error, 4);
  }

  const getNotifications = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const notificationsChanged = useCallback(
    data => {
      if (data) {
        const { message, type, sender, ship, ship_imo } = data;
        // Don't show self sent notifications
        if (user && sender.email !== user.email) {
          let name = '';
          if (type === 'ship') {
            name = (ship && ship.vessel_name) || ship_imo;
          } else {
            name = t('{{username}} (Port of {{portname}})', { portname: portName, username: user.email });
          }
          notification.open({
            message: <NotificationTitle title={message} />,
            description: <NotificationSentBy sender={name} t={t} />,
            duration: 5,
            placement: 'bottomRight',
            closeIcon: <Icon type="close" />,
          });
        }
      }
      getNotifications();
    },
    [getNotifications, portName, t, user]
  );

  useSocket('notifications-changed', notificationsChanged);

  const userNotificationsChanged = useCallback(
    data => {
      if (data) {
        const { message, type, sender, ship, ship_imo } = data;
        // Don't show self sent notifications
        if (user && sender.email !== user.email) {
          let name = '';
          if (type === 'ship') {
            name = (ship && ship.vessel_name) || ship_imo;
          } else {
            name = t('{{username}} (Port of {{portname}})', { portname: portName, username: user.email });
          }
          notification.open({
            message: <NotificationTitle title={message} />,
            description: <NotificationSentBy sender={name} t={t} />,
            duration: 5,
            placement: 'bottomRight',
            closeIcon: <Icon type="close" />,
          });
        }
      }
    },
    [portName, t, user]
  );

  // Notifications for pinned vessels
  useSocket(`notifications-changed-${user.id}`, userNotificationsChanged);

  const apiSendNotification = async (type, title, imo) => {
    const result = await apiCall('post', 'notifications', {
      type: type,
      message: title,
      ship_imo: imo,
    });
    if (result && result.status === 200) {
      // TODO: show success every time to prevent email phishing
      return message.success(t('Notification was sent successfully'), 4);
    }
    return message.error(t(result.data.error), 4);
  };

  const notifications = error || !data ? [] : data;

  return (
    <NotificationContext.Provider
      value={{
        getNotifications: getNotifications,
        notifications: notifications,
        apiSendNotification: apiSendNotification,
        notificationCount: notificationCount,
        loading: loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
