import React, { useContext, useState, useEffect } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT_WITH_TIME_ZONE } from '../../utils/constants';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Popconfirm } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import ShipRoute from '../../components/activity/ShipRoute';

import AdminPortCallTimestamps from './AdminPortCallTimestamps';
import AdminNonPortCallTimestamps from './AdminNonPortCallTimestamps';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const ShipName = styled.p`
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const ShipIMO = styled.p`
  font-size: ${({ theme }) => theme.text.small};
  color: ${({ theme }) => theme.color.grey};
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
  cursor: pointer;
`;

const AdminPortCallList = () => {
  const { apiCall, namespace, user, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Port calls | Port Activity App';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 30;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: 'atd DESC',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'port-calls', defaultParams);

  const portCalls = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;

  let counter = 1;
  portCalls.forEach(p => {
    p._row = start + counter;
    counter++;
  });

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
    hideOnSinglePage: true,
  };

  if (error) {
    setAlert({ type: 'error', message: error });
  }

  const handleTableChange = async pagination => {
    let params = defaultParams;
    params.offset = pageSize * (pagination.current - 1);
    history.push(location.pathname + '?offset=' + params.offset + '&search=' + encodeURIComponent(params.search));
    await fetchData(false, params);
  };

  const doSearch = params => {
    history.push(location.pathname + '?offset=' + params.offset + '&search=' + encodeURIComponent(params.search));
    fetchData(false, params);
  };

  const debouncedSearch = debounce(500, doSearch);

  const handleSearchChange = e => {
    setSearch(e.target.value);
    e.preventDefault();
    let params = defaultParams;
    params.search = e.target.value;
    params.offset = 0;
    debouncedSearch(params);
  };

  const handleClosePortCall = async id => {
    await apiCall('get', 'force-close-port-call', { port_call_id: id });
    let params = defaultParams;
    fetchData(false, params);
  };

  const handleScanPortCall = async id => {
    await apiCall('get', 'force-scan-port-call', { port_call_id: id });
    let params = defaultParams;
    fetchData(false, params);
  };

  const columns = [
    {
      title: t('Ship and route'),
      dataIndex: 'imo',
      width: '30%',
      key: 'imo',
      render: (text, record) => (
        <>
          <ShipName>{record.vessel_name}</ShipName>
          <ShipIMO
            onClick={() =>
              user.permissions.includes('manage_port_call') && history.push(`/vessels/vessel-timestamps/${record.imo}`)
            }
          >
            IMO {record.imo}
          </ShipIMO>
          <ShipRoute from={record.from_port} to={record.to_port} next={record.next_port} />
        </>
      ),
    },
    {
      title: t('Port call ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('ETA'),
      dataIndex: 'current_eta',
      key: 'current_eta',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('RTA'),
      dataIndex: 'rta',
      key: 'rta',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('ATA'),
      dataIndex: 'ata',
      key: 'ata',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('ETD'),
      dataIndex: 'current_etd',
      key: 'current_etd',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('ATD'),
      dataIndex: 'atd',
      key: 'atd',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (text, record) => (
        <RowActions>
          <Button link onClick={() => history.push(`/admin/port-calls/${record.id}`)}>
            <Icon type="action" />
            {t('Timesheet')}
          </Button>
          <br />
          <Popconfirm
            title={t('Really force port call close?')}
            onConfirm={() => handleClosePortCall(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning disabled={!user.permissions.includes('manage_port_call') || record.status === 'done'}>
              <Icon type="action" />
              {t('Close port call')}
            </Button>
          </Popconfirm>
          <br />
          <Popconfirm
            title={t('Really force port call re-scan?')}
            onConfirm={() => handleScanPortCall(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning disabled={!user.permissions.includes('manage_port_call')}>
              <Icon type="action" />
              {t('Re-scan port call')}
            </Button>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      <Page fullWidth title={t('Port calls admin')}>
        <PageSearch value={search} placeholder={t('Search by name or exact IMO')} onChange={handleSearchChange} />
        <div style={{ clear: 'both' }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={portCalls}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            expandedRowRender={record => (
              <>
                <AdminPortCallTimestamps port_call_id={record.id} />
                <AdminNonPortCallTimestamps imo={record.imo} />
              </>
            )}
          />
        </div>
      </Page>
    </Layout>
  );
};

export default AdminPortCallList;
