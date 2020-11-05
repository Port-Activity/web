import React, { useContext, useState, useEffect } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import Table from '../../components/ui/Table';

const InboundVessels = () => {
  const { namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Inbound vessels';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'vessel_name',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'inbound-vessels', defaultParams);

  const inboundVessels = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  inboundVessels.forEach(p => {
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
      title: t('IMO'),
      dataIndex: 'imo',
      key: 'imo',
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
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('ETD'),
      dataIndex: 'time',
      key: 'time',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => record && <Moment format={TIME_FORMAT} date={record} />,
    },
    {
      title: t('From'),
      dataIndex: 'from_service_name',
      key: 'from_service_name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Inbound vessels from other ports')}>
        <PageSearch value={search} placeholder={t('Search by name or exact IMO')} onChange={handleSearchChange} />
        <div style={{ clear: 'both' }}>
          <Spin spinning={loading}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={inboundVessels}
              loading={refreshing}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>
      </Page>
    </Layout>
  );
};

export default InboundVessels;
