import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import AccessControl from '../../components/admin/AccessControl';

const AdminAccessControl = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Access control | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Access control')}>
        <AccessControl />
      </Page>
    </Layout>
  );
};

export default AdminAccessControl;
