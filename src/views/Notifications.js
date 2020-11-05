import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

import NotificationsActions from '../components/notifications/NotificationsActions';
import NotificationsList from '../components/notifications/NotificationsList';

const Notifications = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Notifications | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Notifications')}>
        <NotificationsActions />
        <NotificationsList />
      </Page>
    </Layout>
  );
};

export default Notifications;
