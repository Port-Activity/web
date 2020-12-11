import React, { useContext, useState, useEffect } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Popconfirm, Modal, Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Label from '../../components/ui/Label';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const WindowCalendar = styled.div`
  padding: 0;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const AdminSlotReservations = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [jitEtaDate, setJitEtaDate] = useState(new Date());

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Slot requests';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort')
      ? params.get('sort')
      : 'rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'slot-reservations', defaultParams);
  const { loading: berthsLoading, data: berthsData, error: berthsError } = useApi('get', 'all-nominatable-berths', {});

  const slotRequests = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  slotRequests.forEach(p => {
    p._row = start + counter;
    counter++;
    p.laytime_formatted = p.laytime ? moment.duration(p.laytime).format('HH:mm') : null;
  });

  const fetchedNominatableBerths = berthsError || !berthsData ? [] : berthsData;
  let nominatableBerths = [...fetchedNominatableBerths];
  nominatableBerths.unshift({ id: 0, name: 'Not selected' });
  counter = 1;
  nominatableBerths.forEach(p => {
    p._row = counter;
    counter++;
    p.key = p.id;
    p.label = p.name;
    p.value = p.id;
  });

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
  };

  if (error) {
    setAlert({ type: 'error', message: error });
  }

  const initModal = {
    visible: false,
    confirmLoading: false,
    datesDirty: false,
    berthsDirty: false,
  };

  const [modal, setModal] = useState(initModal);

  const initSlotRequest = {
    id: null,
    laytime: '',
    jit_eta: '',
    rta_window_start: '',
  };

  const [slotRequest, setSlotRequest] = useState(initSlotRequest);

  const showModal = async id => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', 'slot-reservation-by-id', { id });
      data['rta_window_start'] = data['rta_window_start']
        ? data['rta_window_start']
        : moment.utc().format('YYYY-MM-DDTHH:mm:ss+00:00');
      data['jit_eta'] = data['jit_eta'] ? data['jit_eta'] : data['rta_window_start'];
      let rta_window_start = moment.utc(moment(data['rta_window_start'])).format('YYYY-MM-DDTHH:mm:ss+00:00');
      let jit_eta = moment.utc(moment(data['jit_eta'])).format('YYYY-MM-DDTHH:mm:ss+00:00');
      setStartDate(moment(data['rta_window_start']).toDate());
      setJitEtaDate(moment(data['jit_eta']).toDate());
      setSlotRequest({ ...data, rta_window_start, jit_eta });
      setModal({ ...initModal, visible: true });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
  };

  const handleModalOk = async () => {
    setModal({
      ...modal,
      confirmLoading: true,
    });
    setApiCallPending(true);
    let isoLaytime = moment.duration(slotRequest.laytime).toISOString();
    try {
      await apiCall('put', 'slot-reservations', {
        id: slotRequest.id,
        laytime: isoLaytime,
        jit_eta: slotRequest.jit_eta,
        rta_window_start: slotRequest.rta_window_start,
      });
    } catch (e) {
      setModal({
        ...modal,
        confirmLoading: false,
      });
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    setModal({
      ...initModal,
      visible: false,
      confirmLoading: false,
    });
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleModalCancel = () => {
    setModal(initModal);
  };

  const handleModalChange = e => {
    setSlotRequest({ ...slotRequest, [e.target.name]: e.target.value });
  };

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
    let sort = '';
    if (id === 'rta_window_start') {
      sort =
        'rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'rta_window_end') {
      sort =
        'rta_window_end,rta_window_start,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'jit_eta') {
      sort =
        'jit_eta,rta_window_start,rta_window_end,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'laytime_formatted') {
      id = 'laytime';
      sort =
        'laytime,rta_window_start,rta_window_end,jit_eta,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'eta') {
      sort =
        'eta,rta_window_start,rta_window_end,jit_eta,laytime,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'vessel_name') {
      id = 'lower(vessel_name)';
      sort =
        'lower(vessel_name),rta_window_start,rta_window_end,jit_eta,laytime,eta,imo,lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'imo') {
      sort =
        'imo,rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),lower(email),readable_slot_reservation_status,berth_name,id';
    } else if (id === 'email') {
      id = 'lower(email)';
      sort =
        'lower(email),rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,readable_slot_reservation_status,berth_name,id';
    } else if (id === 'readable_slot_reservation_status') {
      sort =
        'readable_slot_reservation_status,rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),berth_name,id';
    } else if (id === 'berth_name') {
      sort =
        'berth_name,rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,id';
    } else if (id === 'id') {
      sort =
        'id,rta_window_start,rta_window_end,jit_eta,laytime,eta,lower(vessel_name),imo,lower(email),readable_slot_reservation_status,berth_name';
    }

    if (params.sort === sort) {
      sort = sort.replace(id, id + ' DESC');
    }

    params.sort = sort;

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

  const handleCancelSlotRequest = async id => {
    setApiCallPending(true);
    try {
      await apiCall('delete', 'slot-reservations', { id, cancel_only: true, by_vessel: false });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleRtaWindowStartChange = e => {
    setStartDate(e);
    let startMoment = moment(e);
    startMoment.set({ second: 0 });
    if (modal.visible) {
      modal.datesDirty = true;
      slotRequest.rta_window_start = moment.utc(startMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
  };

  const handleJitEtaChange = e => {
    setJitEtaDate(e);
    let jitEtaMoment = moment(e);
    jitEtaMoment.set({ second: 0 });
    if (modal.visible) {
      modal.datesDirty = true;
      slotRequest.jit_eta = moment.utc(jitEtaMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
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
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
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
      title: t('Vessel name'),
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
      title: t('ETA'),
      dataIndex: 'eta',
      key: 'eta',
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
      title: t('RTA start'),
      dataIndex: 'rta_window_start',
      key: 'rta_window_start',
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
      title: t('RTA end'),
      dataIndex: 'rta_window_end',
      key: 'rta_window_end',
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
      title: t('Laytime'),
      dataIndex: 'laytime_formatted',
      key: 'laytime',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('JIT ETA'),
      dataIndex: 'jit_eta',
      key: 'jit_eta',
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
      title: t('Berth'),
      dataIndex: 'berth_name',
      key: 'berth_name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Request status'),
      dataIndex: 'readable_slot_reservation_status',
      key: 'readable_slot_reservation_status',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            disabled={
              !(
                record.slot_reservation_status === 'offered' ||
                record.slot_reservation_status === 'accepted' ||
                record.slot_reservation_status === 'updated'
              ) || !user.permissions.includes('manage_queue_slot_reservation')
            }
            style={{ marginRight: '16px' }}
            link
            onClick={() => showModal(record.id)}
          >
            <Icon type="edit" />
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Cancel request {{id}}?', { id: record.id })}
            onConfirm={() => handleCancelSlotRequest(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button
              link
              warning
              disabled={
                record.slot_reservation_status === 'cancelled_by_port' ||
                record.slot_reservation_status === 'cancelled_by_vessel' ||
                record.slot_reservation_status === 'completed' ||
                !user.permissions.includes('manage_queue_slot_reservation')
              }
            >
              <Icon type="trash" />
              {t('Cancel')}
            </Button>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      <Modal
        title={t(`Edit slot request ${slotRequest.id}`)}
        visible={modal.visible}
        onOk={handleModalOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
      >
        <Spin spinning={apiCallPending}>
          <WindowCalendar>
            <Label>{t('RTA window start')}</Label>
            <DatePicker
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd.MM.yyyy HH:mm"
              selected={startDate}
              onChange={handleRtaWindowStartChange}
            />
          </WindowCalendar>
          <WindowCalendar>
            <Label>{t('JIT ETA')}</Label>
            <DatePicker
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              dateFormat="dd.MM.yyyy HH:mm"
              selected={jitEtaDate}
              onChange={handleJitEtaChange}
            />
          </WindowCalendar>
          <Input name="laytime" label="laytime" value={slotRequest.laytime} onChange={handleModalChange} />
        </Spin>
      </Modal>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Slot requests')}>
        <PageSearch value={search} placeholder={t('Search by vessel name')} onChange={handleSearchChange} />
        <div style={{ clear: 'both' }}>
          <Spin spinning={loading || berthsLoading}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={slotRequests}
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

export default AdminSlotReservations;
