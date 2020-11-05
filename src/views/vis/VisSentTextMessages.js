import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import Table from '../../components/ui/Table';

const VisSentTextMessages = props => {
  const pageSize = 20;
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const { service_id } = props.match.params;

  const [refreshing] = useState(false);
  const defaultParams = {
    to_service_id: service_id,
    limit: pageSize,
    offset: 0,
    sort: 'time DESC',
  };
  const { loading, data, error, fetchData } = useApi('get', 'vis-text-messages', defaultParams);

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
      title: t('Author'),
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: t('Body'),
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: t('Ack'),
      dataIndex: 'ack',
      key: 'ack',
      render: record => {
        if (record) {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
    {
      title: t('OP ack'),
      dataIndex: 'operational_ack',
      key: 'operational_ack',
      render: record => {
        if (record) {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page title={t(`VIS sent text messages to ${service_id}`)}>
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

export default VisSentTextMessages;
