import React, { useContext, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import { Popconfirm, Switch, Modal, Alert, Spin } from 'antd';

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

const Berths = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Berths';
  }, []);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'lower(name),lower(code),id,nominatable',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'berths', defaultParams);

  const berths = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  berths.forEach(p => {
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

  const initModal = {
    visible: false,
    confirmLoading: false,
    berth: {
      code: '',
      named: '',
      nominatable: '',
    },
  };

  const [modal, setModal] = useState(initModal);

  const initBerth = {
    id: null,
    code: '',
    name: '',
    nominatable: '',
  };

  const [berth, setBerth] = useState(initBerth);

  const showModal = async id => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', 'berth-by-id', { id });
      setBerth({ ...data });
      setModal({ ...initModal, visible: true });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
  };

  const handleOk = async () => {
    setModal({
      ...modal,
      confirmLoading: true,
    });
    setApiCallPending(true);
    let nominatableBool = false;
    if (berth.nominatable === 'true' || berth.nominatable === true) {
      nominatableBool = true;
    }
    try {
      await apiCall('put', 'berths', {
        id: berth.id,
        code: berth.code,
        name: berth.name,
        nominatable: nominatableBool,
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
    setBerth({ ...berth, [e.target.name]: e.target.value });
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
    if (id === 'id') {
      sort = 'id,lower(name),lower(code),nominatable';
    } else if (id === 'name') {
      sort = 'lower(name),lower(code),id,nominatable';
    } else if (id === 'code') {
      sort = 'lower(code),lower(name),id,nominatable';
    } else if (id === 'nominatable') {
      sort = 'nominatable,lower(name),lower(code),id';
    }
    if (params.sort === sort) {
      sort = sort.replace('lower(name)', 'lower(name) DESC');
      sort = sort.replace('lower(code)', 'lower(code) DESC');
      sort = sort.replace('nominatable', 'nominatable DESC');
      sort = sort.replace('id', 'id DESC');
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
    const { code, name, nominatable } = values;
    let nominatableBool = false;
    if (nominatable === 'true') {
      nominatableBool = true;
    }
    setApiCallPending(true);
    try {
      await apiCall('post', 'berths', {
        code,
        name,
        nominatable: nominatableBool,
      });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    showActions(false);

    values.nominatable = 'true';
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleDelete = async id => {
    setApiCallPending(true);
    try {
      await apiCall('delete', 'berths', { id });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const fields = ['code', 'name', 'nominatable'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, { nominatable: 'true' });

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
  };

  const handleNominatableChange = async (e, checked) => {
    setApiCallPending(true);
    try {
      await apiCall('put', 'berths', { id: e.id, code: e.code, name: e.name, nominatable: checked });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
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
      title: t('Berth code'),
      dataIndex: 'code',
      key: 'code',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Berth name'),
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
      title: t('Nominatable'),
      dataIndex: 'nominatable',
      key: 'nominatable',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: (text, record) => (
        <Switch
          disabled={!user.permissions.includes('manage_berth')}
          checked={text}
          defaultChecked={text}
          onChange={checked => handleNominatableChange(record, checked)}
        ></Switch>
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            disabled={!user.permissions.includes('manage_berth')}
            style={{ marginRight: '16px' }}
            link
            onClick={() => showModal(record.id)}
          >
            <Icon type="edit" />
            {t('Edit')}
          </Button>
          <Popconfirm
            title={t('Delete berth {{name}}?', { name: record.name })}
            onConfirm={() => handleDelete(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning disabled={!user.permissions.includes('manage_berth')}>
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
        title={t(`Edit berth ${berth.name}`)}
        visible={modal.visible}
        onOk={handleOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
      >
        <Spin spinning={apiCallPending}>
          <Input name="code" label="code" value={berth.code} onChange={handleModalChange} />
          <Input name="name" label="name" value={berth.name} onChange={handleModalChange} />
          <Select
            name="nominatable"
            label="Nominatable"
            value={berth.nominatable}
            options={[
              { key: 'Yes', value: true, label: 'Yes' },
              { key: 'No', value: false, label: 'No' },
            ]}
            onChange={handleModalChange}
          />
        </Spin>
      </Modal>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Berths')}>
        <Spin spinning={apiCallPending}>
          <PageSearch value={search} placeholder={t('Search by name or code')} onChange={handleSearchChange} />

          <div ref={actionsRef}>
            <PageAction>
              <Button
                disabled={loading || !user.permissions.includes('manage_berth')}
                onClick={() => showActions(true)}
              >
                <Icon type="user-add" />
                {t('Add new berth')}
              </Button>
              <PageActionForm title={t('Add new berth')} icon="user-add" show={actions}>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  {fields.map(field => {
                    if (field === 'nominatable') {
                      return (
                        <Select
                          value={values.field}
                          label={field.replace(/_/g, ' ')}
                          key={field}
                          name={field}
                          options={[
                            { key: 'Yes', value: true, label: 'Yes' },
                            { key: 'No', value: false, label: 'No' },
                          ]}
                          onChange={handleChange}
                        />
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
                    <Button link>{t('Add berth')}</Button>
                    <Button link onClick={e => handleCancel(e)}>
                      {t('Cancel')}
                    </Button>
                  </FormActions>
                </Form>
              </PageActionForm>
            </PageAction>
          </div>

          <div style={{ clear: 'both' }}>
            <Spin spinning={loading}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={berths}
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

export default Berths;
