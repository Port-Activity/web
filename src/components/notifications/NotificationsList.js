import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { NotificationContext } from '../../context/NotificationContext';
import { UserContext } from '../../context/UserContext';

import { Tabs, List, Tooltip } from 'antd';

import NotificationListItem from './NotificationListItem';

const { TabPane } = Tabs;

const NotificationsList = () => {
  const { namespace, portName } = useContext(UserContext);
  const { notifications, loading } = useContext(NotificationContext);
  const { t } = useTranslation(namespace);

  const shipNotifications = notifications.filter(item => item.type === 'ship');
  const portNotifications = notifications.filter(item => item.type === 'port');

  return (
    <Tabs defaultActiveKey="1" animated={false} size="large">
      <TabPane tab={t('All notifications')} key="1">
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          loading={loading}
          renderItem={item => (
            <List.Item>
              <NotificationListItem data={item} />
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane
        tab={<Tooltip title={t('Notifications related to a single vessel.')}>{t('Ship notifications')}</Tooltip>}
        key="2"
      >
        <List
          itemLayout="horizontal"
          dataSource={shipNotifications}
          loading={loading}
          renderItem={item => (
            <List.Item>
              <NotificationListItem data={item} />
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane
        tab={
          <Tooltip title={t('Notification related to all actors at Port of {{portname}}.', { portname: portName })}>
            {t('Port notifications')}
          </Tooltip>
        }
        key="3"
      >
        <List
          itemLayout="horizontal"
          dataSource={portNotifications}
          loading={loading}
          renderItem={item => (
            <List.Item>
              <NotificationListItem data={item} />
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};

export default NotificationsList;
