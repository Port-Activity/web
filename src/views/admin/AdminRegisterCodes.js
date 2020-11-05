import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import RegisterCodes from '../../components/admin/RegisterCodes';

const AdminRegisterCodes = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Registration codes | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Registration codes')}>
        <RegisterCodes />
      </Page>
    </Layout>
  );
};

export default AdminRegisterCodes;
