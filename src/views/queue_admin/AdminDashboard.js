import React, { useContext, useCallback, useEffect } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';
import useSocket from '../../hooks/useSocket';

import { Alert } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import Table from '../../components/ui/Table';

const AlertGreen = styled.div`
   {
    color: green;
  }
`;

const AlertOrange = styled.div`
   {
    color: darkorange;
  }
`;

const AlertRed = styled.div`
   {
    color: red;
  }
`;

const AdminDashboard = () => {
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Queue - Just-In-Time-Arrival';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
  };
  const { data, error, fetchData } = useApi('get', 'dashboard-slot-reservations', defaultParams);

  const reFetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useSocket('portcalls-changed', reFetch);

  const slotRequests = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  slotRequests.forEach(p => {
    p._row = start + counter;
    counter++;
    p.laytime_formatted = p.laytime ? moment.duration(p.laytime).format('HH:mm') : null;
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
    history.push(location.pathname + '?offset=' + params.offset);
    await fetchData(false, params);
  };

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('Vessel name'),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
    },
    {
      title: t('ETA'),
      dataIndex: 'eta',
      key: 'eta',
      render: record => record && <Moment format={TIME_FORMAT} date={record} />,
    },
    {
      title: t('RTA'),
      dataIndex: 'rta_window_start',
      key: 'rta_window_start',
      render: record => record && <Moment format={TIME_FORMAT} date={record} />,
    },
    {
      title: t('JIT ETA'),
      dataIndex: 'jit_eta',
      key: 'jit_eta',
      render: (text, record) => {
        if (text && record.jit_eta_alert_state === 'green') {
          return (
            <AlertGreen>
              <Moment format={TIME_FORMAT} date={text} />
            </AlertGreen>
          );
        } else if (text && record.jit_eta_alert_state === 'orange') {
          return (
            <AlertOrange>
              <Moment format={TIME_FORMAT} date={text} />
            </AlertOrange>
          );
        } else if (text && record.jit_eta_alert_state === 'red') {
          return (
            <AlertRed>
              <Moment format={TIME_FORMAT} date={text} />
            </AlertRed>
          );
        }
      },
    },
    {
      title: t('Live ETA'),
      dataIndex: 'live_eta',
      key: 'live_eta',
      render: record => record && <Moment format={TIME_FORMAT} date={record} />,
    },
    {
      title: t('PTD'),
      dataIndex: 'ptd',
      key: 'ptd',
      render: record => record && <Moment format={TIME_FORMAT} date={record} />,
    },
    {
      title: t('Berth'),
      dataIndex: 'berth_name',
      key: 'berth_name',
    },
    {
      title: t('Status'),
      dataIndex: 'readable_slot_reservation_status',
      key: 'readable_slot_reservation_status',
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Queue - Just-In-Time-Arrival')}>
        <div style={{ clear: 'both' }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={slotRequests}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </Page>
    </Layout>
  );
};

export default AdminDashboard;
