import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

const NotFound = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = '404 | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('404 - Page Not Found')}></Page>
    </Layout>
  );
};

export default NotFound;
