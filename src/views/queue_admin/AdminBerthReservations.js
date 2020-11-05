import React, { useContext, useRef, useState, useEffect } from 'react';
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

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import { Tabs, Popconfirm, Modal, Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import PageAction from '../../components/page/PageAction';
import PageActionForm from '../../components/page/PageActionForm';
import Form from '../../components/ui/Form';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Label from '../../components/ui/Label';

const { TabPane } = Tabs;

const FormActions = styled.div`
  text-align: right;
  button {
    margin-bottom: 0;
  }
`;

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const ReservationCalendar = styled.div`
  padding: 0;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const AdminBerthReservations = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentBerthId, setCurrentBerthId] = useState(0);
  const [currentBerthName, setCurrentBerthName] = useState('Unknown');

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Berth reservations';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    berth_id: params.get('berth_id') ? params.get('berth_id') : 0,
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort')
      ? params.get('sort')
      : 'reservation_start,reservation_end,readable_berth_reservation_type,lower(vessel_name),id',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'berth-reservations', defaultParams);
  const { loading: berthsLoading, data: berthsData, error: berthsError } = useApi('get', 'all-nominatable-berths', {});

  const reservations = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  reservations.forEach(p => {
    p._row = start + counter;
    counter++;
  });

  const fetchedNominatableBerths = berthsError || !berthsData ? [] : berthsData;
  let nominatableBerths = [...fetchedNominatableBerths];
  counter = 1;
  nominatableBerths.forEach(p => {
    p._row = counter;
    counter++;
    p.key = p.id;
    p.label = p.name;
    p.value = p.id;
  });

  if (!berthsLoading && currentBerthId === 0 && fetchedNominatableBerths.length > 0) {
    let berthId = fetchedNominatableBerths[0].id;
    let berthName = fetchedNominatableBerths[0].name;
    setCurrentBerthId(berthId);
    setCurrentBerthName(berthName);
    let params = defaultParams;
    params.berth_id = berthId;
    history.push(location.pathname + '?berth_id=' + params.berth_id);
    fetchData(false, params);
  }

  const handleTabChange = e => {
    setCurrentBerthId(e);
    let berth = fetchedNominatableBerths.find(berth => berth.id === parseInt(e));
    setCurrentBerthName(berth.name);
    let params = defaultParams;
    params.berth_id = e;
    history.push(location.pathname + '?berth_id=' + params.berth_id);
    fetchData(false, params);
  };

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

  const initReservation = {
    id: null,
    reservation_start: '',
    reservation_end: '',
    readable_berth_reservation_type: '',
    vessel_name: '',
  };

  const [reservation, setReservation] = useState(initReservation);

  const showModal = async id => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', 'berth-reservation-by-id', { id });
      let reservation_start = moment.utc(data['reservation_start']).format('YYYY-MM-DDTHH:mm:ss+00:00');
      let reservation_end = moment.utc(data['reservation_end']).format('YYYY-MM-DDTHH:mm:ss+00:00');
      setStartDate(moment(data['reservation_start']).toDate());
      setEndDate(moment(data['reservation_end']).toDate());
      setReservation({ ...data, reservation_start, reservation_end });
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
    try {
      await apiCall('put', 'berth-reservations', {
        id: reservation.id,
        reservation_start: reservation.reservation_start,
        reservation_end: reservation.reservation_end,
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
    resetDates();
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleModalCancel = () => {
    setModal(initModal);
    resetDates();
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
    if (id === 'vessel_name') {
      id = 'lower(vessel_name)';
      sort = 'lower(vessel_name),reservation_start,reservation_end,readable_berth_reservation_type,id';
    } else if (id === 'reservation_start') {
      sort = 'reservation_start,reservation_end,readable_berth_reservation_type,lower(vessel_name),id';
    } else if (id === 'reservation_end') {
      sort = 'reservation_end,reservation_start,readable_berth_reservation_type,lower(vessel_name),id';
    } else if (id === 'readable_berth_reservation_type') {
      sort = 'readable_berth_reservation_type,reservation_start,reservation_end,lower(vessel_name),id';
    } else if (id === 'id') {
      sort = 'id,reservation_start,reservation_end,readable_berth_reservation_type,lower(vessel_name)';
    }
    if (params.sort === sort) {
      sort = sort.replace(id, id + ' DESC');
    }

    params.sort = sort;

    history.push(
      location.pathname +
        '?berth_id=' +
        params.berth_id +
        '&offset=' +
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
        '?berth_id=' +
        params.berth_id +
        '&offset=' +
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

  const handleSave = async values => {
    const { reservation_start, reservation_end } = values;
    setApiCallPending(true);
    try {
      await apiCall('post', 'berth-reservations', {
        berth_id: currentBerthId,
        berth_reservation_type: 'port_blocked',
        reservation_start,
        reservation_end,
      });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    showActions(false);
    resetDates();

    let params = defaultParams;
    await fetchData(false, params);
  };

  const fields = ['reservation_start', 'reservation_end'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, {
    reservation_start: moment.utc(moment().set({ second: 0 })).format('YYYY-MM-DDTHH:mm:ss+00:00'),
    reservation_end: moment.utc(moment().set({ second: 0 })).format('YYYY-MM-DDTHH:mm:ss+00:00'),
  });

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
    resetDates();
  };

  const handleDelete = async id => {
    setApiCallPending(true);
    try {
      await apiCall('delete', 'berth-reservations', { id });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const resetDates = () => {
    setStartDate(moment().toDate());
    setEndDate(moment().toDate());
    values.reservation_start = moment.utc(moment().set({ second: 0 })).format('YYYY-MM-DDTHH:mm:ss+00:00');
    values.reservation_end = moment.utc(moment().set({ second: 0 })).format('YYYY-MM-DDTHH:mm:ss+00:00');
  };

  const handleReservationStartChange = e => {
    setStartDate(e);
    let startMoment = moment(e);
    startMoment.set({ second: 0 });
    if (modal.visible) {
      modal.datesDirty = true;
      reservation.reservation_start = moment.utc(startMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    } else {
      values.reservation_start = moment.utc(startMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
  };

  const handleReservationEndChange = e => {
    setEndDate(e);
    let endMoment = moment(e);
    endMoment.set({ second: 0 });
    if (modal.visible) {
      modal.datesDirty = true;
      reservation.reservation_end = moment.utc(endMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    } else {
      values.reservation_end = moment.utc(endMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
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
      title: t('Start'),
      dataIndex: 'reservation_start',
      key: 'reservation_start',
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
      title: t('End'),
      dataIndex: 'reservation_end',
      key: 'reservation_end',
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
      title: t('Reservation type'),
      dataIndex: 'readable_berth_reservation_type',
      key: 'readable_berth_reservation_type',
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
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            disabled={
              !user.permissions.includes('manage_berth_reservation') ||
              record.readable_berth_reservation_type !== 'Blocked by port'
            }
            style={{ marginRight: '16px' }}
            link
            onClick={() => showModal(record.id)}
          >
            <Icon type="edit" />
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Delete berth reservation {{id}}?', { id: record.id })}
            onConfirm={() => handleDelete(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button
              link
              warning
              disabled={
                !user.permissions.includes('manage_berth_reservation') ||
                record.readable_berth_reservation_type !== 'Blocked by port'
              }
            >
              <Icon type="trash" />
              {t('Delete')}
            </Button>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      <Modal
        title={t(`Edit reservation ${reservation.id}`)}
        visible={modal.visible}
        onOk={handleModalOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
      >
        <Spin spinning={apiCallPending}>
          <Label>{currentBerthName}</Label>
          <ReservationCalendar>
            <Label>{t('Reservation start')}</Label>
            <DatePicker
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="dd.MM.yyyy HH:mm"
              selected={startDate}
              onChange={handleReservationStartChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </ReservationCalendar>
          <ReservationCalendar>
            <Label>{t('Reservation end')}</Label>
            <DatePicker
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="dd.MM.yyyy HH:mm"
              selected={endDate}
              onChange={handleReservationEndChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </ReservationCalendar>
          <Label>{reservation.readable_berth_reservation_type}</Label>
          <Label>{reservation.vessel_name}</Label>
        </Spin>
      </Modal>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Berth reservations')}>
        <Tabs defaultActiveKey="0" animated={false} size="large" onChange={handleTabChange}>
          {nominatableBerths.map(nominatableBerth => (
            <TabPane tab={nominatableBerth.name} key={nominatableBerth.id}></TabPane>
          ))}
        </Tabs>
        <PageSearch value={search} placeholder={t('Search by vessel name')} onChange={handleSearchChange} />

        <div ref={actionsRef}>
          <PageAction>
            <Button
              disabled={loading || berthsLoading || !user.permissions.includes('manage_berth_reservation')}
              onClick={() => showActions(true)}
            >
              <Icon type="user-add" />
              {t('Add new berth block')}
            </Button>
            <PageActionForm title={t('Add new berth block')} icon="user-add" show={actions}>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Label>{currentBerthName}</Label>
                {fields.map(field => {
                  if (field === 'reservation_start') {
                    return (
                      <ReservationCalendar>
                        <Label>{t('Block start')}</Label>
                        <DatePicker
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={30}
                          dateFormat="dd.MM.yyyy HH:mm"
                          selected={startDate}
                          onChange={handleReservationStartChange}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </ReservationCalendar>
                    );
                  } else if (field === 'reservation_end') {
                    return (
                      <ReservationCalendar>
                        <Label>{t('Block end')}</Label>
                        <DatePicker
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={30}
                          dateFormat="dd.MM.yyyy HH:mm"
                          selected={endDate}
                          onChange={handleReservationEndChange}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                        />
                      </ReservationCalendar>
                    );
                  } else {
                    return (
                      <Input
                        label={field.replace(/_/g, ' ')}
                        key={field}
                        name={field}
                        field={field}
                        value={values.field}
                        onChange={handleChange}
                      />
                    );
                  }
                })}
                <FormActions>
                  <Button link>{t('Add berth block')}</Button>
                  <Button link onClick={e => handleCancel(e)}>
                    {t('Cancel')}
                  </Button>
                </FormActions>
              </Form>
            </PageActionForm>
          </PageAction>
        </div>

        <div style={{ clear: 'both' }}>
          <Spin spinning={loading || berthsLoading}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={reservations}
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

export default AdminBerthReservations;
