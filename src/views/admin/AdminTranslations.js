import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import Translations from '../../components/admin/Translations';

const AdminTranslations = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'String translations | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('String translations')}>
        <Translations />
      </Page>
    </Layout>
  );
};

export default AdminTranslations;
