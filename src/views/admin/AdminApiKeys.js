import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import ApiKeys from '../../components/admin/ApiKeys';

const AdminApiKeys = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'API keys | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('API keys')}>
        <ApiKeys />
      </Page>
    </Layout>
  );
};

export default AdminApiKeys;
