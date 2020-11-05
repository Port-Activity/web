import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

import LogisticsTimeline from '../components/logistics/LogisticsTimeline';

const Logistics = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Logistics | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Logistics')}>
        <LogisticsTimeline />
      </Page>
    </Layout>
  );
};

export default Logistics;
