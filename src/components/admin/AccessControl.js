import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/browser';

import useApi from '../../hooks/useApi';

import { UserContext } from '../../context/UserContext';

import { message, Checkbox, Popconfirm } from 'antd';

import Table from '../ui/Table';

const AccessControl = () => {
  const { apiCall, namespace, user } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  let loading = true;

  const { loading: rolesLoading, data: rolesData, error: rolesError } = useApi('get', 'roles', {});

  const roles = rolesError || !rolesData ? [] : rolesData;

  if (rolesError) {
    message.error(rolesError);
  }

  const { loading: permissionsLoading, data: permissionsData, error: permissionsError } = useApi(
    'get',
    'permissions',
    {}
  );

  const permissions = permissionsError || !permissionsData ? [] : permissionsData;
  if (permissionsError) {
    message.error(permissionsError);
  }

  const { loading: rolePermissionsLoading, data: rolePermissionsData, error: rolePermissionsError, fetchData } = useApi(
    'get',
    'role-permissions',
    {}
  );

  const rolePermissions = rolePermissionsError || !rolePermissionsData ? [] : rolePermissionsData;

  if (rolePermissionsError) {
    message.error(rolePermissionsError);
  }

  let permissionList = [];

  if (!rolesLoading && !permissionsLoading && !rolePermissionsLoading) {
    permissions.forEach(function(permission) {
      let idx = permissionList.push({
        id: permission.id,
        name: permission.readable_name,
        key: permission.name,
      });

      roles.forEach(function(role) {
        let value = false;
        rolePermissions.forEach(function(rolePermission) {
          if (Object.prototype.hasOwnProperty.call(rolePermission, role.name)) {
            if (rolePermission[role.name].includes(permission.name)) {
              value = true;
            }
          }
        });
        permissionList[idx - 1][role.name] = value;
      });
    });
    loading = false;
  }

  const handleConfirm = async (role, permission, checked) => {
    if (!checked) {
      try {
        await apiCall('put', `role-permissions/${role}/${permission}`);
      } catch (error) {
        Sentry.captureException(error);
        message.error(error);
      }
    } else {
      try {
        await apiCall('delete', `role-permissions/${role}/${permission}`);
      } catch (error) {
        Sentry.captureException(error);
        message.error(error);
      }
    }
    fetchData();
  };

  const columns = [
    {
      title: t('Permission'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Administrator'),
      dataIndex: 'admin',
      key: 'admin',
      align: 'center',
      render: (text, record) => <Checkbox defaultChecked={text} disabled={true} name="admin" value={record.key} />,
    },
    {
      title: t('Second Administrator'),
      dataIndex: 'second_admin',
      key: 'second_admin',
      align: 'center',
      render: (text, record) => (
        <Popconfirm
          title={t('Are you sure?')}
          onConfirm={() => handleConfirm('second_admin', record.key, text)}
          okText={t('Yes')}
          okType="danger"
          cancelText={t('No')}
          icon={null}
        >
          <Checkbox
            defaultChecked={text}
            checked={text}
            disabled={!user.permissions.includes('manage_user_second_admin')}
            name="second_admin"
            value={record.key}
            onClick={e => e.preventDefault()}
          />
        </Popconfirm>
      ),
    },
    {
      title: t('First user'),
      dataIndex: 'first_user',
      key: 'first_user',
      align: 'center',
      render: (text, record) => (
        <Popconfirm
          title={t('Are you sure?')}
          onConfirm={() => handleConfirm('first_user', record.key, text)}
          okText={t('Yes')}
          okType="danger"
          cancelText={t('No')}
          icon={null}
        >
          <Checkbox
            defaultChecked={text}
            checked={text}
            disabled={!user.permissions.includes('manage_user_first_user')}
            name="first_user"
            value={record.key}
            onClick={e => e.preventDefault()}
          />
        </Popconfirm>
      ),
    },
    {
      title: t('User'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (text, record) => (
        <Popconfirm
          title={t('Are you sure?')}
          onConfirm={() => handleConfirm('user', record.key, text)}
          okText={t('Yes')}
          okType="danger"
          cancelText={t('No')}
          icon={null}
        >
          <Checkbox
            defaultChecked={text}
            checked={text}
            disabled={!user.permissions.includes('manage_user_user')}
            name="user"
            value={record.key}
            onClick={e => e.preventDefault()}
          />
        </Popconfirm>
      ),
    },
    {
      title: t('Consignee'),
      dataIndex: 'consignee',
      key: 'consignee',
      align: 'center',
      render: (text, record) => (
        <Popconfirm
          title={t('Are you sure?')}
          onConfirm={() => handleConfirm('consignee', record.key, text)}
          okText={t('Yes')}
          okType="danger"
          cancelText={t('No')}
          icon={null}
        >
          <Checkbox
            defaultChecked={text}
            checked={text}
            disabled={!user.permissions.includes('manage_user_consignee')}
            name="consignee"
            value={record.key}
            onClick={e => e.preventDefault()}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      rowKey="id"
      pagination={{ defaultPageSize: 25, hideOnSinglePage: true }}
      columns={columns}
      dataSource={permissionList}
    />
  );
};

export default AccessControl;
