import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import Users from '../../components/admin/Users';

const AdminUsers = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Users | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Users')}>
        <Users />
      </Page>
    </Layout>
  );
};

export default AdminUsers;
