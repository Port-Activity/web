import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import MapPortActors from '../../components/admin/MapPortActors';

const AdminMapPortActors = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Map Port Actors | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Map Port Actors')}>
        <MapPortActors />
      </Page>
    </Layout>
  );
};

export default AdminMapPortActors;
