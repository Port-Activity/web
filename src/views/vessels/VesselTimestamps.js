import React, { useRef, useContext, useState } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import { TIME_FORMAT_WITH_TIME_ZONE } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';

import { Alert, Spin, Popconfirm } from 'antd';
import Text from 'antd/lib/typography/Text';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Table as antdTable } from 'antd';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Form from '../../components/ui/Form';
import Label from '../../components/ui/Label';
import Heading from '../../components/ui/Heading';

import './VesselTimestamps.css';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const PortCallIdWrapper = styled.div`
  white-space: nowrap;
  text-align: right;
  margin-right: 8px;
`;

const MarginButton = styled(Button)`
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const WindowCalendar = styled.div`
  min-width: 350px;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const StyledTimestampTable = styled(antdTable)`
  && {
    width: 100%;
    margin: 0 0 ${({ theme }) => theme.sizing.gap};
    th,
    td {
      padding: 0;
      border-bottom: 1px solid ${({ theme }) => theme.color.grey_light};
      @media print {
        border-bottom: 1pt solid black;
      }
    }
    th {
      font-size: ${({ theme }) => theme.text.small};
      font-weight: 700;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      white-space: nowrap;
      padding: ${({ theme }) => theme.sizing.gap_small} ${({ theme }) => theme.sizing.gap};
    }
    table,
    .ant-table {
      background: none;
      tr,
      th,
      td {
        white-space: nowrap;
      }
    }
    .ant-table-wrapper + .ant-table-wrapper {
      margin-top: ${({ theme }) => theme.sizing.gap_medium};
    }
  }
`;

const LinkHeading = styled(Heading)`
  cursor: pointer;
`;

const BackLink = styled.a`
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.sizing.gap_small};
`;

const PortCallEdit = ({ record, refresh, pending }) => {
  const { user, apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [masterId, setMasterId] = useState('<not set>');
  const [masterManual, setMasterManual] = useState(false);
  const portCallId = record.port_call_id;

  const fetchRange = async () => {
    const { data } = await apiCall('get', 'port-call-range', { port_call_id: portCallId });
    data['start'] ? setStartDate(moment(data['start']).toDate()) : setStartDate(moment().toDate());
    data['end'] ? setEndDate(moment(data['end']).toDate()) : setEndDate(moment().toDate());
    data['master_id'] ? setMasterId(data['master_id']) : setMasterId('<not set>');
    data['master_manual'] ? setMasterManual(data['master_manual']) : setMasterManual(false);
    showActions(true);
  };

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
  };

  const handleRangeStartChange = e => {
    setStartDate(e);
  };

  const handleRangeEndChange = e => {
    setEndDate(e);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    showActions(false);
    pending(true);
    let saveStart = moment.utc(moment(startDate)).format('YYYY-MM-DDTHH:mm:ss+00:00');
    let saveEnd = moment.utc(moment(endDate)).format('YYYY-MM-DDTHH:mm:ss+00:00');
    await apiCall('post', 'port-call-range', { port_call_id: portCallId, start: saveStart, end: saveEnd });
    pending(false);
    refresh();
  };

  if (actions) {
    return (
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <Label>{t('Port call ID: {{id}}', { id: portCallId })}</Label>
        <Label>{t('Master ID: {{id}}', { id: masterId })}</Label>
        <Label>{t('Manual: {{value}}', { value: masterManual })}</Label>
        <WindowCalendar>
          <Label>{t('Port call end')}</Label>
          <DatePicker
            popperPlacement="bottom-start"
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy HH:mm"
            selected={endDate}
            onChange={handleRangeEndChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
          />
        </WindowCalendar>
        <WindowCalendar>
          <Label>{t('Port call start')}</Label>
          <DatePicker
            popperPlacement="bottom-start"
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy HH:mm"
            selected={startDate}
            onChange={handleRangeStartChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </WindowCalendar>
        <Button disabled={!user.permissions.includes('manage_port_call')} link>
          {t('Save')}
        </Button>
        <MarginButton link onClick={e => handleCancel(e)}>
          {t('Cancel')}
        </MarginButton>
      </Form>
    );
  }

  return (
    <div ref={actionsRef}>
      <PortCallIdWrapper>
        <Button link onClick={fetchRange}>
          {portCallId}
        </Button>
      </PortCallIdWrapper>
    </div>
  );
};

const TimestampTable = props => <StyledTimestampTable {...props} />;

const VesselTimestamps = props => {
  const { apiCall, user, namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { imo } = props.match.params;

  const params = new URLSearchParams(location.search);
  const pageSize = 50;

  const defaultParams = {
    imo: imo,
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'time DESC',
  };
  const { loading, data, error, fetchData } = useApi('get', 'timestamps', defaultParams);

  const timestamps = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  let prevPortCall = -1;
  let styleToggle = false;
  timestamps.forEach(p => {
    p._row = start + counter;

    if (p.port_call_id) {
      p.showPortCallModify = false;
      if (p.port_call_id !== prevPortCall) {
        p.showPortCallModify = true;
        styleToggle = !styleToggle;
      }

      if (styleToggle) {
        p.rowClass = 'port_call_light';
      } else {
        p.rowClass = 'port_call_dark';
      }

      prevPortCall = p.port_call_id;
    } else {
      p.rowClass = 'no_port_call';
    }

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

  const handleColumnClick = async id => {
    let params = defaultParams;
    params.offset = 0;
    if (params.sort === id) {
      params.sort = id + ' DESC';
    } else {
      params.sort = id;
    }
    history.push(location.pathname + '?offset=' + params.offset + '&sort=' + params.sort);
    await fetchData(false, params);
  };

  const handleTableChange = async pagination => {
    let params = defaultParams;
    params.offset = pageSize * (pagination.current - 1);
    history.push(location.pathname + '?offset=' + params.offset + '&sort=' + params.sort);
    await fetchData(false, params);
  };

  const handleDelete = async id => {
    setApiCallPending(true);
    await apiCall('delete', 'timestamps', { id: id });
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleRestore = async id => {
    setApiCallPending(true);
    await apiCall('post', 'restore-timestamp', { id: id });
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleRefresh = async () => {
    let params = defaultParams;
    await fetchData(false, params);
  };

  function handleBackToVesselList() {
    history.push('/vessels');
  }

  const columns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('Port call ID'),
      dataIndex: 'port_call_id',
      key: 'port_call_id',
      render: (text, record) => {
        if (record.showPortCallModify) {
          return <PortCallEdit record={record} refresh={handleRefresh} pending={setApiCallPending} />;
        } else {
          return <PortCallIdWrapper>{text}</PortCallIdWrapper>;
        }
      },
    },
    {
      title: t('Time'),
      dataIndex: 'time',
      key: 'time',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('Time type'),
      dataIndex: 'time_type',
      key: 'time_type',
    },
    {
      title: t('State'),
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: t('Trash'),
      dataIndex: 'is_trash',
      key: 'is_trash',
      render: record => {
        if (record === 't') {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
    {
      title: t('Created at'),
      dataIndex: 'created_at',
      key: 'created_at',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
    {
      title: t('Created by'),
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: t('Data'),
      dataIndex: 'payload',
      key: 'payload',
      render: record => {
        let json = JSON.parse(record);
        let ret = '';
        if (json.direction) {
          ret += json.direction;
        }
        return <Text>{ret}</Text>;
      },
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: record => (
        <RowActions>
          <Popconfirm
            title={t('Really delete timestamp permanently?')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning disabled={!user.permissions.includes('manage_port_call')}>
              {t('Delete')}
            </Button>
          </Popconfirm>
          <Button
            link
            disabled={!user.permissions.includes('manage_port_call')}
            onClick={() => history.push(`/vessels/vessel-timestamp/${record.id}`)}
          >
            <Icon type="action" />|{t('Show')}
          </Button>
          <Button
            link
            disabled={!user.permissions.includes('manage_port_call')}
            hidden={record.is_trash === 'f'}
            onClick={() => handleRestore(record.id)}
          >
            <Icon type="action" />|{t('Restore')}
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page>
        <LinkHeading
          onClick={() =>
            user.permissions.includes('manage_port_call') && history.push(`/port-calls?offset=0&search=${imo}`)
          }
        >
          {t(`Timestamps for IMO ${imo}`)}
        </LinkHeading>
        <BackLink disabled={!user.permissions.includes('basic_user_action')} onClick={handleBackToVesselList}>
          {t('« Back to vessel list')}
        </BackLink>
        <Spin spinning={loading || apiCallPending}>
          <TimestampTable
            rowClassName={record => record.rowClass}
            rowKey="id"
            columns={columns}
            dataSource={timestamps}
            loading={refreshing}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </Page>
    </Layout>
  );
};

export default VesselTimestamps;
