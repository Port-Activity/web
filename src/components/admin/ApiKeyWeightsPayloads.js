import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useToggle from '../../hooks/useToggle';
import useApi from '../../hooks/useApi';

import { message } from 'antd';

import Button from '../ui/Button';
import Table from '../ui/Table';
import Select from '../ui/Select';
import Form from '../ui/Form';
import Input from '../ui/Input';

import PageAction from '../page/PageAction';
import PageActionForm from '../page/PageActionForm';

const MarginButton = styled(Button)`
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const NarrowSelect = styled(Select)`
  width: 20%;
`;

const FormActions = styled.div`
  text-align: right;
  button {
    margin-bottom: 0;
  }
`;

const ApiKeyWeightsPayloads = () => {
  const { user, namespace, apiCall } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [apiCallPending, setApiCallPending] = useState(false);
  const [rebuildPayloadData, setRebuildPayloadData] = useState(true);
  const [payloadData, setPayloadData] = useState([]);

  let initNewPayloadKey = {
    payload_key: '',
  };

  const [newPayloadKey, setNewPayloadKey] = useState(initNewPayloadKey);

  const { loading, data, error, fetchData } = useApi('get', 'payload-key-api-key-weights');

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

  const payloads = loading ? [] : data.payload_keys;

  if (rebuildPayloadData && !loading) {
    let tempPayloadData = [];
    payloads.forEach(p => {
      let tempPayload = { state: p.state };
      tempPayload.payload_key = p.key;
      tempPayload.api_keys = p.api_keys.slice(0);
      tempPayload.new_api_keys = [];
      let i;
      for (i = 0; i < 5; i++) {
        if (p.api_keys[i] === undefined) {
          tempPayload.new_api_keys.push({ api_key_id: -1 });
        } else {
          tempPayload.new_api_keys.push({ api_key_id: p.api_keys[i].api_key_id });
        }
      }

      tempPayloadData.push(tempPayload);
    });

    setPayloadData(tempPayloadData);
    setRebuildPayloadData(false);
  }

  const handlePriorityChange = (record, e) => {
    record.new_api_keys[parseInt(e.target.name)].api_key_id = parseInt(e.target.value);
  };

  const handleSave = async () => {
    setApiCallPending(true);
    let ct;
    for (ct = 0; ct < payloadData.length; ct++) {
      const pl = payloadData[ct];
      const filtered_new_api_keys = pl.new_api_keys.filter(item => item.api_key_id !== -1);

      let save = false;
      if (!(filtered_new_api_keys.length === 0 && pl.api_keys.length === 0)) {
        if (filtered_new_api_keys.length === pl.api_keys.length) {
          let i;
          for (i = 0; i < filtered_new_api_keys.length; i++) {
            if (filtered_new_api_keys[i].api_key_id !== pl.api_keys[i].api_key_id) {
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
          await apiCall('post', 'payload-key-api-key-weights', {
            payload_key: pl.payload_key,
            api_key_ids,
          });
        } catch (e) {
          setPayloadData([]);
          await fetchData(false);
          setRebuildPayloadData(true);
          setApiCallPending(false);
          throw e;
        }
      }
    }

    setPayloadData([]);
    await fetchData(false);
    setRebuildPayloadData(true);
    setApiCallPending(false);
  };

  const handleCancel = () => {
    history.push('/');
  };

  const handleAddNewCancel = e => {
    e.preventDefault();
    showActions(false);
    setNewPayloadKey({ ...initNewPayloadKey });
  };

  const handleAddNewSubmit = e => {
    e.preventDefault();
    showActions(false);

    let tempPayloadData = payloadData.slice(0);
    let tempPayload = { payload_key: newPayloadKey.payload_key };
    tempPayload.api_keys = [
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
    ];
    tempPayload.new_api_keys = [
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
      { api_key_id: -1 },
    ];
    tempPayloadData.push(tempPayload);
    setPayloadData(tempPayloadData);

    setNewPayloadKey({ ...initNewPayloadKey });
  };

  const handleAddNewChange = e => {
    newPayloadKey[e.target.name] = e.target.value;
    setNewPayloadKey({ ...newPayloadKey });
  };

  const columns = [
    {
      title: t('Payload key'),
      dataIndex: 'payload_key',
      key: 'payload_key',
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
      dataIndex: 'new_api_keys',
      key: 'new_api_keys',
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
      dataIndex: 'new_api_keys',
      key: 'new_api_keys',
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
      dataIndex: 'new_api_keys',
      key: 'new_api_keys',
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
      <div ref={actionsRef}>
        <PageAction>
          <MarginButton disabled={loading} onClick={() => showActions(true)}>
            {t('Add new payload key')}
          </MarginButton>
          <PageActionForm title={t('Add new payload key')} show={actions}>
            <Form autoComplete="off" onSubmit={handleAddNewSubmit}>
              <Input
                label={t('Payload key')}
                name="payload_key"
                value={newPayloadKey.payload_key}
                onChange={handleAddNewChange}
              />
              <FormActions>
                <Button link>{t('Add')}</Button>
                <Button link onClick={e => handleAddNewCancel(e)}>
                  {t('Cancel')}
                </Button>
              </FormActions>
            </Form>
          </PageActionForm>
          <MarginButton
            disabled={!user.permissions.includes('manage_api_key') || loading || apiCallPending}
            onClick={handleSave}
          >
            Save
          </MarginButton>
          <Button onClick={handleCancel}>Back</Button>
        </PageAction>
      </div>
      <Table
        rowKey="id"
        loading={loading || rebuildPayloadData}
        columns={columns}
        dataSource={payloadData}
        pagination={false}
      />
    </>
  );
};

export default ApiKeyWeightsPayloads;
