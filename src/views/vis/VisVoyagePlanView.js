import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import { Alert } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

const VisVoyagePlanView = props => {
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  let rtz = 'No data';

  if (typeof props.location.data !== 'undefined') {
    const { data } = props.location;
    rtz = data.rtz;
  }

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t('Voyage plan view')}>
        <div>
          <pre>{rtz}</pre>
        </div>
      </Page>
    </Layout>
  );
};

export default VisVoyagePlanView;
