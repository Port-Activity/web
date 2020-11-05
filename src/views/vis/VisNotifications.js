import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import Table from '../../components/ui/Table';

const VisNotifications = () => {
  const pageSize = 20;
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const [refreshing] = useState(false);
  const defaultParams = {
    limit: pageSize,
    offset: 0,
    sort: 'time DESC',
  };
  const { loading, data, error, fetchData } = useApi('get', 'vis-notifications', defaultParams);

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
      title: t('Message ID'),
      dataIndex: 'message_id',
      key: 'message_id',
    },
    {
      title: t('Type'),
      dataIndex: 'message_type',
      key: 'message_type',
    },
    {
      title: t('Notification'),
      dataIndex: 'notification_type',
      key: 'notification_type',
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t('VIS received notifications')}>
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

export default VisNotifications;
