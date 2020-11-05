import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import PageAction from '../../components/page/PageAction';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: ${({ theme }) => theme.sizing.gap_tiny};
  }
`;

const MarginButton = styled(Button)`
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const VisVessels = () => {
  const { namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);

  const history = useHistory();

  useEffect(() => {
    document.title = 'VIS events | Port Activity App';
  }, []);

  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: 0,
    sort: 'vessel_name',
  };
  const { loading, data, error, fetchData } = useApi('get', 'vis-vessels', defaultParams);
  const { loading: loadingPoll, fetchData: fetchPoll } = useApi('get', 'vis-service-poll');

  const visVessels = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  visVessels.forEach(p => {
    p._row = start + counter;
    counter++;
  });
  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
  };

  if (error) {
    setAlert({ type: 'error', message: error });
  }

  const handleTableChange = async pagination => {
    let params = defaultParams;
    params.offset = pageSize * (pagination.current - 1);
    await fetchData(false, params);
  };

  const handleVisServicePoll = async () => {
    await fetchPoll(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('IMO'),
      dataIndex: 'imo',
      key: 'imo',
    },
    {
      title: t('Name'),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
    },
    {
      title: t('Service ID'),
      dataIndex: 'service_id',
      key: 'service_id',
    },
    {
      title: t('Service URL'),
      dataIndex: 'service_url',
      key: 'service_url',
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            disabled={!user.permissions.includes('view_vis_information')}
            onClick={() => history.push(`/vis-vessels/sent-text-messages/${record.service_id}`)}
          >
            Sent TXT
          </Button>
          <Button
            disabled={!user.permissions.includes('view_vis_information')}
            onClick={() => history.push(`/vis-vessels/received-text-messages/${record.service_id}`)}
          >
            Recv TXT
          </Button>
          <Button
            disabled={!user.permissions.includes('view_vis_information')}
            onClick={() => history.push(`/vis-vessels/sent-voyage-plans/${record.service_id}`)}
          >
            Sent VP
          </Button>
          <Button
            disabled={!user.permissions.includes('view_vis_information')}
            onClick={() => history.push(`/vis-vessels/received-voyage-plans/${record.service_id}`)}
          >
            Recv VP
          </Button>
          <Button
            disabled={!user.permissions.includes('send_vis_text_message')}
            onClick={() => history.push(`/vis-vessels/send-text-message/${record.service_id}`)}
          >
            Send TXT
          </Button>
          <Button
            disabled={!user.permissions.includes('send_vis_rta')}
            onClick={() => history.push(`/vis-vessels/send-rta/${record.service_id}`)}
          >
            Send RTA
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t('VIS vessels')}>
        <Spin spinning={loading || loadingPoll}>
          <PageAction>
            <MarginButton
              disabled={!user.permissions.includes('view_vis_information')}
              onClick={() => history.push('/vis-vessels/vis-notifications')}
            >
              Notifications
            </MarginButton>
            <MarginButton
              disabled={!user.permissions.includes('view_vis_information')}
              onClick={() => history.push('/vis-vessels/vis-service-find')}
            >
              Find VIS Service
            </MarginButton>
            <MarginButton
              disabled={!user.permissions.includes('view_vis_information')}
              onClick={() => history.push('/vis-vessels/vis-service-configuration')}
            >
              View VIS Service Configuration
            </MarginButton>
            <Button disabled={!user.permissions.includes('view_vis_information')} onClick={handleVisServicePoll}>
              Poll VIS Service
            </Button>
          </PageAction>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={visVessels}
            loading={refreshing}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </Page>
    </Layout>
  );
};

export default VisVessels;
