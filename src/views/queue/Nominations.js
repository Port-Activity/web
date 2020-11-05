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

import { Popconfirm, Modal, Alert, Spin } from 'antd';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import PageAction from '../../components/page/PageAction';
import PageActionForm from '../../components/page/PageActionForm';
import Form from '../../components/ui/Form';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Label from '../../components/ui/Label';

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

const WindowCalendar = styled.div`
  padding: 0;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Nominations = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Nominations';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort')
      ? params.get('sort')
      : 'lower(vessel_name),imo,readable_nomination_status,window_start,window_end,id',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'own-nominations', defaultParams);
  const { loading: berthsLoading, data: berthsData, error: berthsError } = useApi('get', 'all-nominatable-berths', {});

  const nominations = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  nominations.forEach(p => {
    p._row = start + counter;
    counter++;
    p.berths = p.berth_names.join();
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

  const initNomination = {
    id: null,
    company_name: '',
    email: '',
    imo: '',
    vessel_name: '',
    window_start: '',
    window_end: '',
    first_berth: '',
    second_berth: '',
  };

  const [nomination, setNomination] = useState(initNomination);

  const showModal = async id => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', 'own-nomination-by-id', { id });
      let first_berth = data['berth_ids'][0] === undefined ? '0' : data['berth_ids'][0];
      let second_berth = data['berth_ids'][1] === undefined ? '0' : data['berth_ids'][1];
      let window_start = moment.utc(moment(data['window_start'])).format('YYYY-MM-DDTHH:mm:ss+00:00');
      let window_end = moment.utc(moment(data['window_end'])).format('YYYY-MM-DDTHH:mm:ss+00:00');
      setStartDate(moment(data['window_start']).toDate());
      setEndDate(moment(data['window_end']).toDate());
      setNomination({ ...data, first_berth, second_berth, window_start, window_end });
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
    let berth_ids = [];
    if (nomination.first_berth !== '0') {
      berth_ids.push(nomination.first_berth);
    }
    if (nomination.second_berth !== '0') {
      berth_ids.push(nomination.second_berth);
    }
    setApiCallPending(true);
    try {
      await apiCall('put', 'own-nominations', {
        id: nomination.id,
        company_name: nomination.company_name,
        email: nomination.email,
        imo: nomination.imo,
        vessel_name: nomination.vessel_name,
        ...(modal.datesDirty ? { window_start: nomination.window_start } : {}),
        ...(modal.datesDirty ? { window_end: nomination.window_end } : {}),
        ...(modal.berthsDirty ? { berth_ids: berth_ids } : {}),
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

  const handleModalChange = e => {
    if (e.target.name === 'first_berth' || e.target.name === 'second_berth') {
      modal.berthsDirty = true;
    }

    setNomination({ ...nomination, [e.target.name]: e.target.value });
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
      sort = 'lower(vessel_name),imo,readable_nomination_status,window_start,window_end,id';
    } else if (id === 'imo') {
      sort = 'imo,lower(vessel_name),readable_nomination_status,window_start,window_end,id';
    } else if (id === 'readable_nomination_status') {
      sort = 'readable_nomination_status,lower(vessel_name),imo,window_start,window_end,id';
    } else if (id === 'window_start') {
      sort = 'window_start,lower(vessel_name),imo,readable_nomination_status,window_end,id';
    } else if (id === 'window_end') {
      sort = 'window_end,lower(vessel_name),imo,readable_nomination_status,window_start,id';
    } else if (id === 'id') {
      sort = 'id,lower(vessel_name),imo,readable_nomination_status,window_start,window_end';
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

  const handleSave = async values => {
    const { company_name, email, imo, vessel_name, window_start, window_end, first_berth, second_berth } = values;
    let berth_ids = [];
    if (first_berth !== '0') {
      berth_ids.push(first_berth);
    }
    if (second_berth !== '0') {
      berth_ids.push(second_berth);
    }
    setApiCallPending(true);
    try {
      await apiCall('post', 'own-nominations', {
        company_name,
        email,
        imo,
        vessel_name,
        window_start,
        window_end,
        berth_ids,
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

  const fields = [
    'company_name',
    'email',
    'imo',
    'vessel_name',
    'window_start',
    'window_end',
    'first_berth',
    'second_berth',
  ];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, {
    first_berth: '0',
    second_berth: '0',
    window_start: moment.utc(moment().set({ second: 0, minute: 0, hour: 0 })).format('YYYY-MM-DDTHH:mm:ss+00:00'),
    window_end: moment.utc(moment().set({ second: 59, minute: 59, hour: 23 })).format('YYYY-MM-DDTHH:mm:ss+00:00'),
  });

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
    resetDates();
  };

  const handleDelete = async id => {
    setApiCallPending(true);
    try {
      await apiCall('delete', 'own-nominations', { id });
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
    values.window_start = moment
      .utc(moment().set({ second: 0, minute: 0, hour: 0 }))
      .format('YYYY-MM-DDTHH:mm:ss+00:00');
    values.window_end = moment
      .utc(moment().set({ second: 59, minute: 59, hour: 23 }))
      .format('YYYY-MM-DDTHH:mm:ss+00:00');
  };

  const handleWindowStartChange = e => {
    setStartDate(e);
    let startMoment = moment(e);
    startMoment.set({ second: 0, minute: 0, hour: 0 });
    if (modal.visible) {
      modal.datesDirty = true;
      nomination.window_start = moment.utc(startMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    } else {
      values.window_start = moment.utc(startMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }
  };

  const handleWindowEndChange = e => {
    setEndDate(e);
    let endMoment = moment(e);
    endMoment.set({ second: 59, minute: 59, hour: 23 });
    if (modal.visible) {
      modal.datesDirty = true;
      nomination.window_end = moment.utc(endMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
    } else {
      values.window_end = moment.utc(endMoment).format('YYYY-MM-DDTHH:mm:ss+00:00');
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
      title: t('Company name'),
      dataIndex: 'company_name',
      key: 'company_name',
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
      title: t('Window start'),
      dataIndex: 'window_start',
      key: 'window_start',
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
      title: t('Window end'),
      dataIndex: 'window_end',
      key: 'window_end',
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
      title: t('Berths'),
      dataIndex: 'berths',
      key: 'berths',
    },
    {
      title: t('Status'),
      dataIndex: 'readable_nomination_status',
      key: 'readable_nomination_status',
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
              !user.permissions.includes('manage_own_queue_nomination') || record.readable_nomination_status !== 'Open'
            }
            style={{ marginRight: '16px' }}
            link
            onClick={() => showModal(record.id)}
          >
            <Icon type="edit" />
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Delete nomination {{id}}?', { id: record.id })}
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
                !user.permissions.includes('manage_own_queue_nomination') ||
                record.readable_nomination_status !== 'Open'
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
        title={t(`Edit nomination ${nomination.id}`)}
        visible={modal.visible}
        onOk={handleModalOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
      >
        <Spin spinning={apiCallPending}>
          <Input
            name="company_name"
            label="company name"
            value={nomination.company_name}
            onChange={handleModalChange}
          />
          <Input name="email" label="email" value={nomination.email} onChange={handleModalChange} />
          <Input name="imo" label="imo" value={nomination.imo} onChange={handleModalChange} />
          <Input name="vessel_name" label="vessel_name" value={nomination.vessel_name} onChange={handleModalChange} />
          <WindowCalendar>
            <Label>{t('Window start')}</Label>
            <DatePicker
              dateFormat="dd.MM.yyyy"
              selected={startDate}
              onChange={handleWindowStartChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={moment().toDate()}
              maxDate={moment()
                .add(1, 'month')
                .toDate()}
            />
          </WindowCalendar>
          <WindowCalendar>
            <Label>{t('Window end')}</Label>
            <DatePicker
              dateFormat="dd.MM.yyyy"
              selected={endDate}
              onChange={handleWindowEndChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={moment().toDate()}
              maxDate={moment()
                .add(1, 'month')
                .toDate()}
            />
          </WindowCalendar>
          <Select
            value={nomination.first_berth}
            label="First berth"
            name="first_berth"
            options={nominatableBerths}
            onChange={handleModalChange}
          />
          <Select
            value={nomination.second_berth}
            label="Second berth"
            name="second_berth"
            options={nominatableBerths}
            onChange={handleModalChange}
          />
        </Spin>
      </Modal>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Nominations')}>
        <PageSearch value={search} placeholder={t('Search by name or exact IMO')} onChange={handleSearchChange} />

        <div ref={actionsRef}>
          <PageAction>
            <Button
              disabled={loading || berthsLoading || !user.permissions.includes('manage_own_queue_nomination')}
              onClick={() => showActions(true)}
            >
              <Icon type="user-add" />
              {t('Add new nomination')}
            </Button>
            <PageActionForm title={t('Add new nomination')} icon="user-add" show={actions}>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                {fields.map(field => {
                  if (field === 'first_berth' || field === 'second_berth') {
                    return (
                      <Select
                        value={values.field}
                        label={field.replace(/_/g, ' ')}
                        key={field}
                        name={field}
                        options={nominatableBerths}
                        onChange={handleChange}
                      />
                    );
                  } else if (field === 'window_start') {
                    return (
                      <WindowCalendar>
                        <Label>{t('Window start')}</Label>
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={startDate}
                          onChange={handleWindowStartChange}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={moment().toDate()}
                          maxDate={moment()
                            .add(1, 'month')
                            .toDate()}
                        />
                      </WindowCalendar>
                    );
                  } else if (field === 'window_end') {
                    return (
                      <WindowCalendar>
                        <Label>{t('Window end')}</Label>
                        <DatePicker
                          dateFormat="dd.MM.yyyy"
                          selected={endDate}
                          onChange={handleWindowEndChange}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          maxDate={moment()
                            .add(1, 'month')
                            .toDate()}
                        />
                      </WindowCalendar>
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
                  <Button link>{t('Add nomination')}</Button>
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
              dataSource={nominations}
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

export default Nominations;
