import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import { Tabs } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

import ApiKeyWeightsTimestamps from '../../components/admin/ApiKeyWeightsTimestamps';
import ApiKeyWeightsPayloads from '../../components/admin/ApiKeyWeightsPayloads';

const { TabPane } = Tabs;

const AdminApiKeyWeights = props => {
  const { selected } = props.match.params;
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [selectedTab, setSelectedTab] = useState(selected);
  const history = useHistory();

  useEffect(() => {
    document.title = 'API key priorities | Port Activity App';
  }, []);

  const handleTabChange = e => {
    history.push('/admin/api-key-weights/' + e);
    setSelectedTab(e);
  };

  return (
    <Layout>
      <Page title={t('API key priorities')}>
        <Tabs defaultActiveKey={selected} animated={false} size="large" onChange={handleTabChange}>
          <TabPane tab="Timestamps" key="timestamps"></TabPane>
          <TabPane tab="Payloads" key="payloads"></TabPane>
        </Tabs>
        {selectedTab === 'timestamps' && <ApiKeyWeightsTimestamps />}
        {selectedTab === 'payloads' && <ApiKeyWeightsPayloads />}
      </Page>
    </Layout>
  );
};

export default AdminApiKeyWeights;
