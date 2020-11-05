import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import styled from 'styled-components';

import { PAGINATION_LIMIT } from '../../utils/constants';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';
import useToggle from '../../hooks/useToggle';

import { Switch, message } from 'antd';

import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Form from '../ui/Form';
import Input from '../ui/Input';
import Table from '../ui/Table';

import PageSearch from '../page/PageSearch';
import PageAction from '../page/PageAction';
import PageActionForm from '../page/PageActionForm';

const FormActions = styled.div`
  text-align: right;
  button {
    margin-bottom: 0;
  }
`;

const ApiKeys = () => {
  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);

  const pageSize = PAGINATION_LIMIT;

  const defaultParams = {
    limit: pageSize,
    offset: 0,
    sort: 'name',
  };

  const { loading, data, error, fetchData } = useApi('get', 'api-keys', defaultParams);

  if (error) {
    message.error(error, 4);
  }

  const apiKeys = loading ? [] : data.data;

  const { start, total } = error || !data ? {} : data.pagination;

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
    hideOnSinglePage: true,
  };

  const handleSave = async values => {
    const { name } = values;
    await apiCall('post', 'api-keys', { name });
    showActions(false);
    fetchData();
  };

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
  };

  const handleToggle = async (id, is_active) => {
    await apiCall('put', `api-keys/${is_active ? 'disable' : 'enable'}`, { id });
    fetchData();
  };

  const handleTableChange = async pagination => {
    let params = defaultParams;
    params.offset = pageSize * (pagination.current - 1);
    await fetchData(false, params);
  };

  const fields = ['name'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave);

  const doSearch = params => {
    fetchData(false, params);
  };

  const debouncedSearch = debounce(500, doSearch);

  const handleSearchChange = e => {
    e.preventDefault();
    let params = defaultParams;
    params.search = e.target.value;
    debouncedSearch(params);
  };

  const columns = [
    {
      title: t('Enabled'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (text, record) => (
        <Switch defaultChecked={text} onChange={() => handleToggle(record.id, record.is_active)}></Switch>
      ),
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('API key'),
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: t('Bound user'),
      dataIndex: 'bound_user_id',
      key: 'bound_user_id',
    },
  ];

  return (
    <>
      <PageSearch placeholder={t('Search API keys by name')} onChange={handleSearchChange} />
      <div ref={actionsRef}>
        <PageAction>
          <Button disabled={loading} onClick={() => showActions(true)}>
            <Icon type="key-add" />
            {t('Add API key')}
          </Button>
          <PageActionForm title={t('Add API key')} icon="key-add" show={actions}>
            <Form onSubmit={handleSubmit}>
              {fields.map(field => (
                <Input
                  label={field.replace(/_/g, ' ')}
                  key={field}
                  name={field}
                  field={field}
                  value={values.field}
                  onChange={handleChange}
                />
              ))}
              <FormActions>
                <Button link>{t('Add API key')}</Button>
                <Button link onClick={e => handleCancel(e)}>
                  {t('Cancel')}
                </Button>
              </FormActions>
            </Form>
          </PageActionForm>
        </PageAction>
        <Table
          rowKey="id"
          pagination={pagination}
          loading={loading}
          columns={columns}
          dataSource={apiKeys}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
};

export default ApiKeys;
