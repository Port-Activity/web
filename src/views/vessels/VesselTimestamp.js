import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

const VesselTimestamp = props => {
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const { id } = props.match.params;
  const defaultParams = {
    id: id,
  };
  const { loading, data, error } = useApi('get', 'timestamps', defaultParams);

  const timestamp = error || !data ? [] : data;
  const timestampData = timestamp.data;

  if (error) {
    setAlert({ type: 'error', message: error });
  }

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t('Timestamp') + ' ' + id}>
        <Spin spinning={loading}>
          <div>
            <pre>{JSON.stringify(timestampData, null, 2)}</pre>
          </div>
        </Spin>
      </Page>
    </Layout>
  );
};

export default VesselTimestamp;
