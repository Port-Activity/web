import React, { useContext, useEffect } from 'react';
import Moment from 'react-moment';
import { TIME_FORMAT_WITH_TIME_ZONE } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import styled from 'styled-components';

import useApi from '../../hooks/useApi';

import { UserContext } from '../../context/UserContext';

import Layout from '../../components/Layout';

import { Alert } from 'antd';

import Page from '../../components/ui/Page';
import Table from '../../components/ui/Table';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

import PageAction from '../../components/page/PageAction';
import { useHistory } from 'react-router-dom';

const BackLink = styled.a`
  float: left;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.sizing.gap_small};
`;

const MarginButton = styled(Button)`
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const AdminPortCallTimesheet = props => {
  const { user, apiCall, namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const { id } = props.match.params;

  const { data, error } = useApi('get', 'port-call', { id });

  const history = useHistory();

  function handleClick() {
    history.goBack();
  }

  const handleDownloadCsv = async () => {
    let tz = moment.tz.guess();

    const response = await apiCall('get', 'port-call-csv', { id, time_zone: tz }, null, 'blob');

    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let fileName = id + '-' + data.ship.imo + '-' + encodeURIComponent(data.ship.vessel_name) + '.csv';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: t('Activity'),
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: t('Time'),
      dataIndex: 'time',
      key: 'time',
      render: record => record && <Moment format={TIME_FORMAT_WITH_TIME_ZONE} date={record} />,
    },
  ];

  const portCall = error || !data ? { ship: {}, timestamps: [] } : data;

  let key = 1;

  const portCallTimestamps = portCall.timestamps.map(timestamp => {
    let maybeLocation = timestamp.payload && timestamp.payload.location;
    return {
      key,
      activity: t(
        timestamp.time_type + ' ' + timestamp.state.replace(/_/g, ' ') + (maybeLocation ? ' ' + maybeLocation : '')
      ),
      time: timestamp.time,
    };
  });

  const startDateIso = portCallTimestamps.length ? moment(portCallTimestamps[0].time).format('YYYY-DD-MM') : 'n/a';

  useEffect(() => {
    document.title = `Date ${startDateIso}, Port call #${id}, IMO #${portCall.ship.imo} | Port Activity App`;
  }, [id, portCall.ship.imo, startDateIso]);

  return (
    <Layout>
      {alert && <Alert message={alert.message} type={alert.type} banner closable afterClose={() => setAlert(null)} />}
      <Page
        title={
          <>
            {t('Port call #{{id}}', {
              id: portCall.ship.id,
            })}
            <br />
            {t('{{ship}}, IMO {{imo}}', {
              ship: portCall.ship.vessel_name,
              id: portCall.ship.id,
              imo: portCall.ship.imo,
            })}
          </>
        }
      >
        <BackLink onClick={handleClick}>{t('« Back to previous page')}</BackLink>
        <PageAction>
          <MarginButton onClick={() => window.print()}>
            <Icon type="print" />
            {t('Print timesheet')}
          </MarginButton>
          <MarginButton onClick={handleDownloadCsv}>
            <Icon type="action" />
            {t('Download as CSV')}
          </MarginButton>
          <MarginButton
            disabled={!user.permissions.includes('manage_port_call')}
            onClick={() => history.push(`/port-calls?offset=0&search=${portCall.ship.imo}`)}
          >
            {t('All port calls')}
          </MarginButton>
          <Button
            disabled={!user.permissions.includes('manage_port_call')}
            onClick={() => history.push(`/vessels/vessel-timestamps/${portCall.ship.imo}`)}
          >
            {t('All timestamps')}
          </Button>
        </PageAction>
        <Table rowKey="id" dataSource={portCallTimestamps} columns={columns} pagination={false} />
      </Page>
    </Layout>
  );
};

export default AdminPortCallTimesheet;
