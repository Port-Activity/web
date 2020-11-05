import React, { useContext } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT_WITH_TIME_ZONE } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import Table from '../../components/ui/Table';
import Icon from '../../components/ui/Icon';

const TableTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.color.warning};
  i {
    width: 24px;
    height: 24px;
  }
  svg {
    margin-right: ${({ theme }) => theme.sizing.gap_small};
  }
`;

const AdminNonPortCallTimestamps = ({ imo }) => {
  const pageSize = 20;
  const { namespace, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const defaultParams = {
    imo,
    limit: pageSize,
    offset: 0,
    sort: 'id',
  };

  const { loading, data, error, fetchData } = useApi('get', 'non-port-call-timestamps', defaultParams);

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
    await fetchData(false, params);
  };

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'timestamp_id',
    },
    {
      title: t('Type'),
      dataIndex: 'time_type',
      key: 'time_type',
    },
    {
      title: t('State'),
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: t('Time'),
      dataIndex: 'time',
      key: 'time',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('Trash'),
      dataIndex: 'is_trash',
      key: 'is_trash',
    },
    {
      title: t('Created at'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('Created by'),
      dataIndex: 'created_by',
      key: 'created_by',
    },
  ];

  return (
    portCalls.length > 0 && (
      <Table
        title={() => (
          <TableTitle>
            <Icon type="close" />
            {t('Timestamp not in any port call')}
          </TableTitle>
        )}
        rowKey="id"
        columns={columns}
        dataSource={portCalls}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    )
  );
};

export default AdminNonPortCallTimestamps;
