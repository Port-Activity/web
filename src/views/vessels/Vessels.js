import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Alert, Spin, Popconfirm, Modal, message } from 'antd';

import Text from 'antd/lib/typography/Text';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';
import PageSearch from '../../components/page/PageSearch';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import SelectWithSearch from '../../components/ui/SelectWithSearch';

const RowActions = styled.div`
  button {
    padding: 0;
    margin: 0;
  }
`;

const Vessels = () => {
  const { apiCall, namespace, user, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const [refreshing] = useState(false);
  const [apiCallPending, setApiCallPending] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Vessels';
  }, []);

  const initEditedVessel = {
    id: null,
    vessel_type: null,
  };

  const [editedVessel, setEditedVessel] = useState(initEditedVessel);

  const initModal = {
    visible: false,
    confirmLoading: false,
    vessel: {
      id: null,
      vessel_type: null,
    },
  };

  const [modal, setModal] = useState(initModal);

  const params = new URLSearchParams(location.search);
  const pageSize = 10;
  const defaultParams = {
    limit: pageSize,
    offset: params.get('offset') ? params.get('offset') : 0,
    sort: params.get('sort') ? params.get('sort') : 'vessel_name',
    search: params.get('search') ? params.get('search') : '',
  };
  const [search, setSearch] = useState(params.get('search') ? params.get('search') : '');

  const { loading: typesLoading, data: typesData, error: typesError } = useApi('get', 'vessel-types', {});

  if (typesError) {
    message.error(typesError, 4);
  }

  const vesselTypes =
    typesData && typesData.length > 0
      ? typesData.map(type => {
          type.key = type.name;
          type.label = type.name;
          type.value = type.id;
          return type;
        })
      : [];

  const { loading, data, error, fetchData } = useApi('get', 'vessels', defaultParams);
  const vessels = error || !data ? [] : data.data;
  const { start, total } = error || !data ? {} : data.pagination;
  let counter = 1;
  vessels.forEach(p => {
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
    if (params.sort === id) {
      params.sort = id + ' DESC';
    } else {
      params.sort = id;
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

  const handleShowHideVessel = async e => {
    setApiCallPending(true);
    await apiCall('post', 'vessel-visibility', { imo: e.imo, visible: !e.visible });
    setApiCallPending(false);
    let params = defaultParams;
    await fetchData(false, params);
  };

  const handleTimestampAttach = async imo => {
    setApiCallPending(true);
    await apiCall('get', 'timestamps-to-port-calls', { imo: imo });
    setApiCallPending(false);
    let params = defaultParams;
    fetchData(false, params);
  };

  const showModal = async id => {
    let matchingVessel = vessels.find(vessel => {
      return vessel.id === id;
    });
    if (matchingVessel) {
      setEditedVessel({ ...matchingVessel });
      setModal({ ...initModal, visible: true });
    }
  };

  const handleModalOk = async () => {
    setModal({
      ...modal,
      confirmLoading: true,
    });
    setApiCallPending(true);
    try {
      const result = await apiCall('put', 'vessel', {
        id: editedVessel.id,
        vesselType: parseInt(editedVessel.vessel_type),
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
    setEditedVessel(initEditedVessel);
    let params = defaultParams;
    fetchData(false, params);
  };

  const handleModalCancel = async () => {
    setModal(initModal);
    setEditedVessel(initEditedVessel);
  };

  const handleModalVesselTypeChange = value => {
    setEditedVessel({ ...editedVessel, vessel_type: value });
  };

  const vesselTypeToString = vesselType => {
    if (!vesselTypes) {
      return t('Unknown Vessel Type');
    }
    let matchingType = vesselTypes.find(type => {
      return type.id === vesselType;
    });
    return matchingType ? matchingType['name'] : t('Unknown Vessel Type');
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
      title: t('Name'),
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
      title: t('Type'),
      dataIndex: 'vessel_type',
      key: 'vessel_type',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: value => value + ' (' + vesselTypeToString(value) + ')',
    },
    {
      title: t('Visible'),
      dataIndex: 'visible',
      key: 'visible',
      onHeaderCell: column => {
        return {
          onClick: () => {
            handleColumnClick(column.dataIndex);
          },
        };
      },
      render: record => {
        if (record) {
          return <Text>T</Text>;
        } else {
          return <Text>F</Text>;
        }
      },
    },
    {
      title: t('Actions'),
      key: 'actions',
      width: '25%',
      render: (text, record) => (
        <RowActions>
          <Button
            link
            disabled={!user.permissions.includes('manage_port_call')}
            onClick={() => handleShowHideVessel(record)}
          >
            <Icon type="action" />
            {record.visible ? t('Hide') : t('Show')}
          </Button>
          <br />
          <Button link disabled={!user.permissions.includes('manage_vessel')} onClick={() => showModal(record.id)}>
            <Icon type="action" />
            {t('Change vessel type')}
          </Button>
          <br />
          <Button
            link
            disabled={!user.permissions.includes('manage_port_call')}
            onClick={() => history.push(`/vessels/vessel-timestamps/${record.imo}`)}
          >
            <Icon type="action" />
            {t('Show timestamps')}
          </Button>
          <br />
          <Popconfirm
            title={t('Really attach orphan timestamps to port calls?')}
            onConfirm={() => handleTimestampAttach(record.imo)}
            okText={t('Yes')}
            okType="danger"
            cancelText={t('No')}
            icon={null}
          >
            <Button link warning disabled={!user.permissions.includes('manage_port_call')}>
              <Icon type="action" />
              {t('Attach orphan timestamps')}
            </Button>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page fullWidth title={t('Vessels')}>
        <Spin spinning={apiCallPending}>
          <Modal
            title={t(`Change vessel type for ${editedVessel.vessel_name}`)}
            visible={modal.visible}
            onOk={handleModalOk}
            confirmLoading={modal.confirmLoading}
            onCancel={handleModalCancel}
          >
            <SelectWithSearch
              name="vessel_type"
              label={t('Vessel type')}
              value={editedVessel.vessel_type}
              options={vesselTypes}
              onChange={handleModalVesselTypeChange}
            />
          </Modal>
          <PageSearch value={search} placeholder={t('Search by name or exact IMO')} onChange={handleSearchChange} />
          <div style={{ clear: 'both' }}>
            <Spin spinning={loading || typesLoading}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={vessels}
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

export default Vessels;
