import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import styled from 'styled-components';

import { PAGINATION_LIMIT } from '../../utils/constants';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';
import useToggle from '../../hooks/useToggle';

import { message, Popconfirm, Modal, Spin } from 'antd';

import SelectWithSearch from '../ui/SelectWithSearch';
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

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const MapPortActors = () => {
  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);

  const [apiCallPending, setApiCallPending] = useState(false);
  const [applyChangesDisabled, setApplyChangesDisabled] = useState(true);

  const initPortActor = {
    id: null,
    vessel_name: '',
    imo: null,
    mmsi: null,
    vessel_type: 1,
    readable_type_name: '',
    created_at: '',
    created_by: '',
    modified_at: '',
    modified_by: '',
  };

  const [portActor, setPortActor] = useState(initPortActor);

  const initModal = {
    visible: false,
    confirmLoading: false,
    portActor: {
      id: null,
      vessel_name: '',
      imo: null,
      mmsi: null,
      vessel_type: 1,
      readable_type_name: '',
      created_at: '',
      created_by: '',
      modified_at: '',
      modified_by: '',
    },
  };

  const [modal, setModal] = useState(initModal);

  const pageSize = PAGINATION_LIMIT;

  const defaultParams = {
    limit: pageSize,
    offset: 0,
    sort: 'vessel_name',
  };

  const {
    loading: portActorsLoading,
    data: portActorsData,
    error: portActorsError,
    fetchData: portActorsFetchData,
  } = useApi('get', 'sea-chart/fixed-vessels', defaultParams);

  if (portActorsError) {
    message.error(portActorsError, 4);
  }

  const mapPortActors = portActorsLoading || !portActorsData || !portActorsData.data ? [] : portActorsData.data;

  const { start, total } = portActorsError || !portActorsData ? {} : portActorsData.pagination;

  const { loading: typesLoading, data: typesData, error: typesError } = useApi('get', 'vessel-types', {});

  if (typesError) {
    message.error(typesError, 4);
  }

  const portActorTypes =
    typesData && typesData.length > 0
      ? typesData.map(type => {
          type.key = type.name;
          type.label = type.name;
          type.value = type.id;
          return type;
        })
      : [];

  const showModal = async entryIdentifier => {
    setApiCallPending(true);
    try {
      const { data } = await apiCall('get', 'sea-chart/fixed-vessel', { id: entryIdentifier });
      setPortActor({ ...data });
      setModal({ ...initModal, visible: true });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
  };

  const handleDelete = async entryIdentifier => {
    setApiCallPending(true);
    try {
      await apiCall('delete', 'sea-chart/fixed-vessel', { id: entryIdentifier });
    } catch (e) {
      setApiCallPending(false);
      throw e;
    }
    setApiCallPending(false);
    await portActorsFetchData(false, defaultParams);
  };

  const pagination = {
    pageSize,
    current: Math.round(start / pageSize) + 1,
    total,
    hideOnSinglePage: true,
  };

  const handleSave = async values => {
    const { vessel_name, imo, mmsi, vessel_type } = values;
    const result = await apiCall('post', 'sea-chart/fixed-vessel', {
      vesselType: parseInt(vessel_type),
      vesselName: vessel_name,
      imo: parseInt(imo),
      mmsi: parseInt(mmsi),
    });

    if (result && result.data.result === 'ERROR' && result.data.message.length) {
      message.error(result.data.message, 4);
    } else {
      showActions(false);
      setPortActor(initPortActor);
      portActorsFetchData();
    }
  };

  const handleCancel = e => {
    e.preventDefault();
    showActions(false);
    setPortActor(initPortActor);
  };

  const handleModalOk = async () => {
    setModal({
      ...modal,
      confirmLoading: true,
    });
    setApiCallPending(true);
    try {
      const result = await apiCall('put', 'sea-chart/fixed-vessel', {
        id: portActor.id,
        vesselName: portActor.vessel_name ? portActor.vessel_name : '',
        vesselType: parseInt(portActor.vessel_type),
        imo: portActor.imo ? parseInt(portActor.imo) : null,
        mmsi: portActor.mmsi ? parseInt(portActor.mmsi) : null,
      });
      if (result && result.data.result === 'ERROR' && result.data.message.length) {
        message.error(result.data.message, 4);
      }
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
    setPortActor(initPortActor);
    await portActorsFetchData(false, defaultParams);
  };

  const handleModalCancel = async () => {
    setModal(initModal);
    setPortActor(initPortActor);
  };

  const handleModalChange = e => {
    setPortActor({ ...portActor, [e.target.name]: e.target.value });
  };

  const handleModalVesselTypeChange = value => {
    setPortActor({ ...portActor, vessel_type: value });
  };

  const handleAddNewChange = e => {
    handleChange(e);
    setPortActor({ ...portActor, [e.target.name]: e.target.value });
  };

  const handleTableChange = async pagination => {
    let params = defaultParams;
    params.offset = pageSize * (pagination.current - 1);
    await portActorsFetchData(false, params);
  };

  const fields = ['imo', 'mmsi', 'vessel_name', 'vessel_type'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave, { vessel_type: 1 });

  const doSearch = params => {
    portActorsFetchData(false, params);
  };

  const debouncedSearch = debounce(500, doSearch);

  const handleSearchChange = e => {
    e.preventDefault();
    let params = defaultParams;
    params.search = e.target.value;
    debouncedSearch(params);
  };

  useEffect(() => {
    let isValid =
      ((portActor.imo !== null && portActor.imo.toString().length > 0) ||
        (portActor.mmsi !== null && portActor.mmsi.toString().length > 0)) &&
      portActor.vessel_name !== null &&
      portActor.vessel_name.length > 0
        ? true
        : false;
    setApplyChangesDisabled(!isValid);
  }, [setApplyChangesDisabled, portActor, mapPortActors]);

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
    },
    {
      title: t('IMO'),
      dataIndex: 'imo',
      key: 'imo',
    },
    {
      title: t('MMSI'),
      dataIndex: 'mmsi',
      key: 'mmsi',
    },
    {
      title: t('Type'),
      dataIndex: 'readable_type_name',
      key: 'readable_type_name',
    },
    {
      title: t('Created by'),
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: record => {
        return (
          <RowActions>
            <Button style={{ marginRight: '16px' }} link onClick={() => showModal(record.id)}>
              <Icon type="edit" />
              {t('Edit')}
            </Button>
            <Popconfirm
              title={t('Delete {{name}}?', { name: record.vessel_name })}
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
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title={t('Edit port actor')}
        visible={modal.visible}
        onOk={handleModalOk}
        confirmLoading={modal.confirmLoading}
        onCancel={handleModalCancel}
        okButtonProps={{ disabled: applyChangesDisabled }}
      >
        <Spin spinning={apiCallPending}>
          <Input
            name="vessel_name"
            label={t('Vessel name')}
            value={portActor.vessel_name ? portActor.vessel_name : ''}
            onChange={handleModalChange}
            required
          />
          <Input
            name="imo"
            label={t('IMO')}
            type="number"
            value={portActor.imo ? portActor.imo : ''}
            onChange={handleModalChange}
          />
          <Input
            name="mmsi"
            label={t('MMSI')}
            type="number"
            value={portActor.mmsi ? portActor.mmsi : ''}
            onChange={handleModalChange}
          />
          <SelectWithSearch
            name="vessel_type"
            label={t('Type')}
            value={portActor.vessel_type}
            options={portActorTypes}
            onChange={handleModalVesselTypeChange}
          />
        </Spin>
      </Modal>
      <PageSearch placeholder={t('Search vessel by name')} onChange={handleSearchChange} />
      <div /*ref={actionsRef}*/>
        <PageAction>
          <Button disabled={portActorsLoading || typesLoading} onClick={() => showActions(true)}>
            <Icon type="add" />
            {t('Add port actor')}
          </Button>
          <PageActionForm title={t('Add port actor')} icon="add" show={actions}>
            <Form onSubmit={handleSubmit}>
              {fields.map(field => {
                if (field === 'vessel_type') {
                  return (
                    <SelectWithSearch
                      label={t('Type')}
                      key={field}
                      name={field}
                      value={values.field}
                      options={portActorTypes}
                      defaultValue={portActor.vessel_type}
                      onChange={handleModalVesselTypeChange}
                    />
                  );
                } else {
                  const type = field === 'mmsi' || field === 'imo' ? 'number' : 'text';
                  return (
                    <Input
                      label={field.replace(/_/g, ' ')}
                      key={field}
                      name={field}
                      field={field}
                      value={values.field}
                      type={type}
                      onChange={handleAddNewChange}
                    />
                  );
                }
              })}
              <FormActions>
                <Button link disabled={applyChangesDisabled ? true : false}>
                  {t('Add port actor')}
                </Button>
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
          loading={portActorsLoading || typesLoading}
          columns={columns}
          dataSource={mapPortActors}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
};

export default MapPortActors;
