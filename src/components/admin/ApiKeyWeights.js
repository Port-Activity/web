import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { message } from 'antd';

import Button from '../ui/Button';
import Table from '../ui/Table';
import Select from '../ui/Select';

import PageAction from '../page/PageAction';

const MarginButton = styled(Button)`
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const NarrowSelect = styled(Select)`
  width: 20%;
`;

const ApiKeyWeights = () => {
  const { user, namespace, apiCall } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [apiCallPending, setApiCallPending] = useState(false);
  const [rebuildTimestampData, setRebuildTimestampData] = useState(true);
  const [timestampData, setTimestampData] = useState([]);

  const { loading, data, error, fetchData } = useApi('get', 'timestamp-api-key-weights');

  const history = useHistory();

  if (error) {
    message.error(error, 4);
  }

  const emptyApiKey = [
    {
      id: -1,
      name: '',
      is_active: true,
    },
  ];

  const apiKeys = loading ? [] : emptyApiKey.concat(data.api_keys);
  apiKeys.forEach(p => {
    p.label = p.name;
    p.value = p.id;
  });

  const timestamps = loading ? [] : data.timestamps;

  if (rebuildTimestampData && !loading) {
    let tempTimestampData = [];
    timestamps.forEach(p => {
      let tempTimestamp = { state: p.state };
      tempTimestamp.time_type = p.time_type;
      tempTimestamp.title = p.time_type
        .concat(' ')
        .concat(p.state)
        .replace(/_/g, ' ');
      tempTimestamp.api_keys = p.api_keys.slice(0);
      tempTimestamp.new_api_keys = [];
      let i;
      for (i = 0; i < 5; i++) {
        if (p.api_keys[i] === undefined) {
          tempTimestamp.new_api_keys.push({ api_key_id: -1 });
        } else {
          tempTimestamp.new_api_keys.push({ api_key_id: p.api_keys[i].api_key_id });
        }
      }

      tempTimestampData.push(tempTimestamp);
    });

    setTimestampData(tempTimestampData);
    setRebuildTimestampData(false);
  }

  const handlePriorityChange = (record, e) => {
    record.new_api_keys[parseInt(e.target.name)].api_key_id = parseInt(e.target.value);
  };

  const handleSave = async () => {
    setApiCallPending(true);
    let ct;
    for (ct = 0; ct < timestampData.length; ct++) {
      const ts = timestampData[ct];
      const filtered_new_api_keys = ts.new_api_keys.filter(item => item.api_key_id !== -1);

      let save = false;
      if (!(filtered_new_api_keys.length === 0 && ts.api_keys.length === 0)) {
        if (filtered_new_api_keys.length === ts.api_keys.length) {
          let i;
          for (i = 0; i < filtered_new_api_keys.length; i++) {
            if (filtered_new_api_keys[i].api_key_id !== ts.api_keys[i].api_key_id) {
              save = true;
            }
          }
        } else {
          save = true;
        }
      }

      if (save) {
        let api_key_ids = [];
        filtered_new_api_keys.forEach(p => {
          api_key_ids.push(p.api_key_id);
        });
        try {
          await apiCall('post', 'timestamp-api-key-weights', {
            timestamp_time_type: ts.time_type,
            timestamp_state: ts.state,
            api_key_ids,
          });
        } catch (e) {
          setTimestampData([]);
          await fetchData(false);
          setRebuildTimestampData(true);
          setApiCallPending(false);
          throw e;
        }
      }
    }

    setTimestampData([]);
    await fetchData(false);
    setRebuildTimestampData(true);
    setApiCallPending(false);
  };

  const handleCancel = () => {
    history.push('/');
  };

  const columns = [
    {
      title: t('Timestamps'),
      dataIndex: 'title',
      key: 'title',
      render: text => {
        return t(`${text}`);
      },
    },
    {
      title: t('Priority 1'),
      dataIndex: 'new_api_keys',
      key: 'new_api_keys',
      render: (text, record) => {
        return (
          <NarrowSelect
            defaultValue={record.new_api_keys[0].api_key_id}
            name="0"
            options={apiKeys}
            onChange={e => handlePriorityChange(record, e)}
          />
        );
      },
    },
    {
      title: t('Priority 2'),
      dataIndex: 'api_keys',
      key: 'api_keys',
      render: (text, record) => {
        return (
          <NarrowSelect
            defaultValue={record.new_api_keys[1].api_key_id}
            name="1"
            options={apiKeys}
            onChange={e => handlePriorityChange(record, e)}
          />
        );
      },
    },
    {
      title: t('Priority 3'),
      dataIndex: 'api_keys',
      key: 'api_keys',
      render: (text, record) => {
        return (
          <NarrowSelect
            defaultValue={record.new_api_keys[2].api_key_id}
            name="2"
            options={apiKeys}
            onChange={e => handlePriorityChange(record, e)}
          />
        );
      },
    },
    {
      title: t('Priority 4'),
      dataIndex: 'api_keys',
      key: 'api_keys',
      render: (text, record) => {
        return (
          <NarrowSelect
            defaultValue={record.new_api_keys[3].api_key_id}
            name="3"
            options={apiKeys}
            onChange={e => handlePriorityChange(record, e)}
          />
        );
      },
    },
    {
      title: t('Priority 5'),
      dataIndex: 'api_keys',
      key: 'api_keys',
      render: (text, record) => {
        return (
          <NarrowSelect
            defaultValue={record.new_api_keys[4].api_key_id}
            name="4"
            options={apiKeys}
            onChange={e => handlePriorityChange(record, e)}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageAction>
        <MarginButton
          disabled={!user.permissions.includes('manage_api_key') || loading || apiCallPending}
          onClick={handleSave}
        >
          Save
        </MarginButton>
        <Button onClick={handleCancel}>Back</Button>
      </PageAction>
      <Table
        rowKey="id"
        loading={loading || rebuildTimestampData}
        columns={columns}
        dataSource={timestampData}
        pagination={false}
      />
    </>
  );
};

export default ApiKeyWeights;
