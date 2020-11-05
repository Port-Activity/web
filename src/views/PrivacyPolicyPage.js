import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

import PrivacyPolicy from './PrivacyPolicy';

const PrivacyPolicyPage = () => {
  const { namespace, user } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  useEffect(() => {
    document.title = 'Privacy policy | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={t('Privacy policy')}>
        <PrivacyPolicy user={user} />
      </Page>
    </Layout>
  );
};

export default PrivacyPolicyPage;
