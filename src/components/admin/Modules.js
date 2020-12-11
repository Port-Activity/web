import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import { Switch } from 'antd';

import Table from '../ui/Table';

const Modules = () => {
  const { apiCall, namespace, modules } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const handleToggle = async (key, is_active) => {
    const result = await apiCall('put', `settings/${key}/${is_active ? 'disabled' : 'enabled'}`);
    if (result && result.status === 200) {
      window.location.reload();
    }
  };

  const modulesData = Object.keys(modules).map((key, id) => {
    const name = key.charAt(0).toUpperCase() + key.substring(1);
    return {
      id: id + 1,
      key: key,
      name: name.replace(/_/g, ' '),
      is_active: modules[key] === 'enabled' ? true : false,
    };
  });

  const columns = [
    {
      title: t('Enabled'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      width: '128px',
      render: (text, record) => (
        <Switch defaultChecked={text} onChange={() => handleToggle(record.key, record.is_active)}></Switch>
      ),
    },
    {
      title: t('Module name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return <Table rowKey="id" pagination={{ hideOnSinglePage: true }} columns={columns} dataSource={modulesData} />;
};

export default Modules;
