import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';

import Text from 'antd/lib/typography/Text';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const Ports = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Other ports';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'name',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'ports', defaultParams);

  const ports = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  ports.forEach(p => {
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
    history.push(
      location.pathname +
        '?offset=' +
        params.offset +
        '&sort=' +
        params.sort +
        '&search=' +
        encodeURIComponent(params.search)
    );
    await fetchData(false, params);
  };

  const handleColumnClick = async id => {
    let params = defaultParams;
    params.offset = 0;
    if (params.sort === id) {
      params.sort = id + ' DESC';
    } else {
      params.sort = id;
    }
    history.push(
      location.pathname +
        '?offset=' +
        params.offset +
        '&sort=' +
        params.sort +
        '&search=' +
        encodeURIComponent(params.search)
    );
    await fetchData(false, params);
  };

  const doSearch = params => {
    history.push(
      location.pathname +
        '?offset=' +
        params.offset +
        '&sort=' +
        params.sort +
        '&search=' +
        encodeURIComponent(params.search)
    );
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

  const handleBlackWhiteIn = async e => {
    setApiCallPending(true);
    await apiCall('post', 'port-whitelist-in', { service_id: e.service_id, whitelist: !e.whitelist_in });
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleBlackWhiteOut = async e => {
    setApiCallPending(true);
    await apiCall('post', 'port-whitelist-out', { service_id: e.service_id, whitelist: !e.whitelist_out });
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Service ID'),
      dataIndex: 'service_id',
      key: 'service_id',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('LOCODES'),
      dataIndex: 'locodes',
      key: 'locodes',
    },
    {
      title: t('Whitelist IN'),
      dataIndex: 'whitelist_in',
      key: 'whitelist_in',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => {
        if (record) {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
    {
      title: t('Whitelist OUT'),
      dataIndex: 'whitelist_out',
      key: 'whitelist_out',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => {
        if (record) {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button link disabled={!user.permissions.includes('manage_port')} onClick={() => handleBlackWhiteIn(record)}>
            <Icon type="action" />
            {record.whitelist_in ? t('Blacklist IN') : t('Whitelist IN')}
          </Button>
          <br />
          <Button link disabled={!user.permissions.includes('manage_port')} onClick={() => handleBlackWhiteOut(record)}>
            <Icon type="action" />
            {record.whitelist_out ? t('Blacklist OUT') : t('Whitelist OUT')}
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Other ports')}>
        <Spin spinning={apiCallPending}>
          <PageSearch value={search} placeholder={t('Search by name or exact IMO')} onChange={handleSearchChange} />
          <div style={{ clear: 'both' }}>
            <Spin spinning={loading}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={ports}
                loading={refreshing}
                pagination={pagination}
                onChange={handleTableChange}
              />
            </Spin>
          </div>
        </Spin>
      </Page>
    </Layout>
  );
};

export default Ports;
