import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import Modules from '../../components/admin/Modules';

const AdminModules = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Modules | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Modules')}>
        <Modules />
      </Page>
    </Layout>
  );
};

export default AdminModules;
