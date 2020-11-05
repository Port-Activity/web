import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import ApiKeyWeights from '../../components/admin/ApiKeyWeights';

const AdminApiKeyWeights = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'API key priorities | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('API key priorities')}>
        <ApiKeyWeights />
      </Page>
    </Layout>
  );
};

export default AdminApiKeyWeights;
