import React, { useContext, useRef, useState } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import { Switch, Popconfirm, message, Spin } from 'antd';

import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Table from '../ui/Table';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Form from '../ui/Form';

import PageAction from '../page/PageAction';
import PageActionForm from '../page/PageActionForm';
import PageSearch from '../page/PageSearch';
import { debounce } from 'throttle-debounce';
import { PAGINATION_LIMIT } from '../../utils/constants';
import { useHistory, useLocation } from 'react-router-dom';

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

const RegisterCodes = () => {
  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);

  let loading = true;

  const [apiCallPending, setApiCallPending] = useState(false);
  const { loading: rolesLoading, data: rolesData, error: rolesError } = useApi('get', 'roles', {});
  const roles = rolesError || !rolesData ? [] : rolesData;

  const history = useHistory();
  const location = useLocation();

  if (rolesError) {
    message.error(rolesError);
  }

  let defaultRoles = [];

  let validRoles = ['consignee', 'user', 'first_user', 'second_admin', 'admin'];
  if (!rolesLoading) {
    roles.forEach(function(role) {
      if (validRoles.includes(role.name)) {
        defaultRoles.push({
          key: role.name,
          label: role.readable_name,
          value: role.name,
        });
      }
    });
  }

  const params = new URLSearchParams(location.search);
  const pageSize = PAGINATION_LIMIT;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'created_at DESC',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');

  const { loading: codesLoading, data: codesData, error: codesError, fetchData } = useApi(
    'get',
    'registration-codes',
    defaultParams
  );

  const codes = codesError || !codesData ? [] : codesData.data;

  if (codesError) {
    message.error(codesError);
  }

  const { start, total } = codesError || !codesData ? {} : codesData.pagination;

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
    hideOnSinglePage: true,
  };

  if (!codesLoading && !rolesLoading) {
    loading = false;
  }

  const handleSave = async values => {
    let apiCallError = null;
    const { description, role } = values;
    setApiCallPending(true);
    showActions(false);
    try {
      await apiCall('post', 'registration-codes', {
        description,
        role,
      });
    } catch (e) {
      apiCallError = e;
    }
    values.role = 'user';
    setApiCallPending(false);
    if (apiCallError !== null) {
      throw apiCallError;
    }
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleDelete = async id => {
    let apiCallError = null;
    setApiCallPending(true);
    try {
      await apiCall('delete', `registration-codes/${id}`, {});
    } catch (e) {
      apiCallError = e;
    }
    setApiCallPending(false);
    if (apiCallError !== null) {
      throw apiCallError;
    }
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleUpdate = async (id, enabled, role) => {
    let apiCallError = null;
    setApiCallPending(true);
    try {
      await apiCall('put', `registration-codes/${id}`, { enabled: enabled ? 1 : 0, role: role });
    } catch (e) {
      apiCallError = e;
    }
    setApiCallPending(false);
    if (apiCallError !== null) {
      throw apiCallError;
    }
    let params = defaultParams;
    await fetchData(false, params);
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

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
  };

  const fields = ['description', 'role'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, { role: 'user' });

  const columns = [
    {
      title: t('Enabled'),
      dataIndex: 'enabled',
      key: 'enabled',
      render: (text, record) => (
        <Switch defaultChecked={text} onChange={enabled => handleUpdate(record.id, enabled, record.role)}></Switch>
      ),
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Code'),
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
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Default role'),
      dataIndex: 'readable_name',
      key: 'readable_name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Created by'),
      dataIndex: 'email',
      key: 'email',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Created'),
      dataIndex: 'created_at',
      key: 'created_at',
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
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: record => (
        <RowActions>
          <Popconfirm
            title={t('Delete code {{code}}?', { code: record.code })}
            onConfirm={() => handleDelete(record.id)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning>
              <Icon type="trash" />
              {t('Delete')}
            </Button>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

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

  const handleColumnClick = async id => {
    let params = defaultParams;
    params.offset = 0;

    let sort = '';
    if (id === 'code') {
      sort = 'lower(code)';
    } else if (id === 'description') {
      sort = 'lower(description)';
    } else if (id === 'email') {
      sort = 'lower(email)';
    } else if (id === 'readable_name') {
      sort = 'lower(readable_name)';
    } else {
      sort = id;
    }

    if (params.sort === sort) {
      params.sort = sort + ' DESC';
    } else {
      params.sort = sort;
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

  return (
    <>
      <Spin spinning={apiCallPending}>
        <PageSearch value={search} placeholder={t('Search codes by description')} onChange={handleSearchChange} />
        <div ref={actionsRef}>
          <PageAction>
            <Button style={{ position: 'relative', zIndex: '5' }} disabled={loading} onClick={() => showActions(true)}>
              <Icon type="add" />
              {t('Add new code')}
            </Button>
            <PageActionForm title={t('Add new code')} icon="user-add" show={actions}>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                {fields.map(field => {
                  if (field === 'role') {
                    return (
                      <Select
                        value={values.role}
                        label={field.replace(/_/g, ' ')}
                        key={field}
                        name={field}
                        options={defaultRoles}
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
                  <Button link>{t('Add code')}</Button>
                  <Button link onClick={e => handleCancel(e)}>
                    {t('Cancel')}
                  </Button>
                </FormActions>
              </Form>
            </PageActionForm>
          </PageAction>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={codes}
          pagination={pagination}
          loading={apiCallPending}
          onChange={handleTableChange}
        />
      </Spin>
    </>
  );
};

export default RegisterCodes;
