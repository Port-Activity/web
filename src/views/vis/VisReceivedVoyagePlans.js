import React, { useContext, useState } from 'react';
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

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const VisReceivedVoyagePlans = props => {
  const pageSize = 20;
  const { namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const { service_id } = props.match.params;

  const [refreshing] = useState(false);
  const defaultParams = {
    from_service_id: service_id,
    limit: pageSize,
    offset: 0,
    sort: 'time DESC',
  };
  const { loading, data, error, fetchData } = useApi('get', 'vis-voyage-plans', defaultParams);

  const history = useHistory();

  const visMessages = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  visMessages.forEach(p => {
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

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('Time'),
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: t('From'),
      dataIndex: 'from_name',
      key: 'from_name',
    },
    {
      title: t('To'),
      dataIndex: 'to_name',
      key: 'to_name',
    },
    {
      title: t('Voyage plan ID'),
      dataIndex: 'message_id',
      key: 'message_id',
    },
    {
      title: t('RTZ state'),
      dataIndex: 'rtz_state_name',
      key: 'rtz_state_name',
    },
    {
      title: t('eta'),
      dataIndex: 'eta',
      key: 'eta',
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            disabled={!user.permissions.includes('view_vis_information')}
            onClick={() =>
              history.push({
                pathname: '/vis-vessels/voyage-plan-view',
                data: record,
              })
            }
          >
            Show
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t(`VIS received voyage plans from ${service_id}`)}>
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={visMessages}
            loading={refreshing}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </Page>
    </Layout>
  );
};

export default VisReceivedVoyagePlans;
