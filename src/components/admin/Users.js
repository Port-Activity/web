import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import { UserContext } from '../../context/UserContext';

import { PAGINATION_LIMIT } from '../../utils/constants';

import { Modal, Popconfirm, message, Alert, Spin } from 'antd';

import Input from '../ui/Input';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Select from '../ui/Select';
import Form from '../ui/Form';
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

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const Users = () => {
  const { user: sessionUser, namespace, apiCall } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);

  const [rolesArr, setRolesArr] = useState([]);
  const [usersArr, setUsersArr] = useState({ data: [] });

  const [apiCallPending, setApiCallPending] = useState(false);

  const { loading: rolesLoading, data: rolesData, error: rolesError } = useApi('get', 'roles', {});

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setRolesArr(rolesData);
  }, [rolesData]);

  function mapOrder(array, order, key) {
    array.sort(function(a, b) {
      let A = a[key],
        B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  }

  const roleOrder = ['admin', 'second_admin', 'first_user', 'user', 'consignee', 'inactive_user'];
  const roles =
    rolesArr && rolesArr.length > 0
      ? mapOrder(
          rolesArr.map(prettyRole => {
            prettyRole.key = prettyRole.name;
            prettyRole.label = prettyRole.readable_name;
            prettyRole.value = prettyRole.name;
            return prettyRole;
          }),
          roleOrder,
          'name'
        )
      : [];

  if (rolesError) {
    message.error(rolesError);
  }

  const initModal = {
    visible: false,
    confirmLoading: false,
    user: {
      first_name: '',
      last_name: '',
      email: '',
      role: '',
    },
    passwords: {
      password: '',
      password_again: '',
      error: '',
      info: '',
    },
  };

  const [modal, setModal] = useState(initModal);

  const initUser = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    created_at: '',
  };

  const initPasswords = {
    password: '',
    password_again: '',
    error: '',
    info: '',
  };

  const [user, setUser] = useState(initUser);
  const [passwords, setPasswords] = useState(initPasswords);

  const params = new URLSearchParams(location.search);
  const pageSize = PAGINATION_LIMIT;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'lower(last_name),lower(first_name),lower(email),id',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');
  const { loading, data, error, fetchData } = useApi('get', 'users', defaultParams);

  useEffect(() => {
    setUsersArr(data);
  }, [data]);

  let users =
    usersArr && usersArr.data && rolesArr
      ? usersArr.data.map(prettyUser => {
          rolesArr.forEach(role => {
            if (role.id === prettyUser.role_id) {
              prettyUser.role = role.name;
              prettyUser.role_readable_name = role.readable_name;
            }
          });
          return prettyUser;
        })
      : [];

  const { start, total } = error || !data ? {} : data.pagination;

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
    hideOnSinglePage: true,
  };

  if (error) {
    message.error(error);
  }

  const showModal = async id => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', `users/${id}`);
      roles.forEach(function(role) {
        if (role.id === data.role_id) {
          data.role = role.value;
        }
      });
      setPasswords(initPasswords);
      setUser({ ...data });
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
    setPasswords(initPasswords);
    user.updateRole = true;
    setApiCallPending(true);
    try {
      await apiCall('put', `users/${user.id}`, user);
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
    if (id === 'last_name') {
      sort = 'lower(last_name),lower(first_name),lower(email),id';
    } else if (id === 'first_name') {
      sort = 'lower(first_name),lower(last_name),lower(email),id';
    } else if (id === 'email') {
      sort = 'lower(email),lower(last_name),lower(first_name),id';
    } else if (id === 'id') {
      sort = 'id,lower(last_name),lower(first_name),lower(email)';
    }
    if (params.sort === sort) {
      sort = sort.replace('lower(last_name)', 'lower(last_name) DESC');
      sort = sort.replace('lower(first_name)', 'lower(first_name) DESC');
      sort = sort.replace('lower(email)', 'lower(email) DESC');
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

  const handleModalCancel = () => {
    setModal(initModal);
  };

  const handleModalChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleModalPasswordChange = useCallback(
    e => {
      setPasswords({ ...passwords, [e.target.name]: e.target.value });
    },
    [passwords]
  );

  const handleSave = async values => {
    const { email, first_name, last_name, role } = values;
    setApiCallPending(true);
    try {
      await apiCall('post', 'users', {
        email,
        first_name,
        last_name,
        role,
      });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    showActions(false);
    values.role = 'user';
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleDelete = async id => {
    setApiCallPending(true);
    try {
      await apiCall('delete', `users/${id}`);
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleCancel = e => {
    e.preventDefault();
    setPasswords(initPasswords);
    showActions(false);
  };

  const handlePasswordChange = async () => {
    const { password, password_again } = passwords;
    const okMessage = t('Password has been changed');
    if (password === password_again) {
      setApiCallPending(true);
      try {
        await apiCall('post', 'change-password', { email: user.email, password });
      } catch (e) {
        setApiCallPending(false);
        throw e;
      }
      setApiCallPending(false);
      setPasswords({ password: '', password_again: '', info: t(okMessage) });
    }
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

  const fields = ['first_name', 'last_name', 'email', 'role'];

  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, { role: 'user' });

  const { password, password_again, info } = passwords;

  const columns = [
    {
      title: t('User ID'),
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
      title: t('Last name'),
      dataIndex: 'last_name',
      key: 'last_name',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('First name'),
      dataIndex: 'first_name',
      key: 'first_name',
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
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
    },
    {
      title: t('Role'),
      dataIndex: 'role_readable_name',
      key: 'role_readable_name',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: record => {
        return (
          <RowActions>
            <Button
              disabled={!sessionUser.permissions.includes('manage_user_' + record.role)}
              style={{ marginRight: '16px' }}
              link
              onClick={() => showModal(record.id)}
            >
              <Icon type="edit" />
              {t('Edit')}
            </Button>
            <Popconfirm
              title={t('Delete user {{name}}?', { name: record.first_name })}
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
                  sessionUser.id === record.id || !sessionUser.permissions.includes(`manage_user_${record.role}`)
                }
                title={t('Deleting yourself is not allowed')}
              >
                <Icon type="trash" />
                {t('Delete')}
              </Button>
            </Popconfirm>
          </RowActions>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title={t(`Edit user ${user.first_name} ${user.last_name}`)}
        visible={modal.visible}
        onOk={handleOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
      >
        <Spin spinning={apiCallPending}>
          <Input name="first_name" label="First name" value={user.first_name} onChange={handleModalChange} />
          <Input name="last_name" label="Last name" value={user.last_name} onChange={handleModalChange} />
          <Input name="email" label="Email" value={user.email} onChange={handleModalChange} />
          <Select name="role" label="Role" value={user.role} options={roles} onChange={handleModalChange} />
          {password === password_again ? '' : <Alert type="error" message={t('Password do not match')} />}
          {info && <Alert type="success" message={t(info)} />}
          <Input
            type="password"
            name="password"
            label={t('Password')}
            value={password}
            onChange={handleModalPasswordChange}
          />
          <Input
            type="password"
            name="password_again"
            label={t('Confirm password')}
            value={password_again}
            onChange={handleModalPasswordChange}
          />
          <Button
            disabled={password === '' || password !== password_again}
            style={{ marginRight: '16px' }}
            link
            onClick={handlePasswordChange}
          >
            <Icon type="save" />
            {t('Change password now')}
          </Button>
        </Spin>
      </Modal>
      <Spin spinning={apiCallPending}>
        <PageSearch value={search} placeholder={t('Search users by name or email')} onChange={handleSearchChange} />
        <div ref={actionsRef}>
          <PageAction>
            <Button disabled={loading || rolesLoading} onClick={() => showActions(true)}>
              <Icon type="user-add" />
              {t('Add new user')}
            </Button>
            <PageActionForm title={t('Add new user')} icon="user-add" show={actions}>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                {fields.map(field => {
                  if (field === 'role') {
                    return (
                      <Select
                        value={values.role}
                        label={field.replace(/_/g, ' ')}
                        key={field}
                        name={field}
                        options={roles}
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
                  <Button link>{t('Add user')}</Button>
                  <Button link onClick={e => handleCancel(e)}>
                    {t('Cancel')}
                  </Button>
                </FormActions>
              </Form>
            </PageActionForm>
          </PageAction>
        </div>
      </Spin>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        pagination={pagination}
        loading={loading || rolesLoading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Users;
