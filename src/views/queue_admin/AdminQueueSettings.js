import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';

import { Spin } from 'antd';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

const AdminQueueSettings = () => {
  const { loading, data, error, fetchData } = useApi('get', 'settings');

  const { apiCall, namespace, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();

  const [apiCallPending, setApiCallPending] = useState(false);

  let initSettings = {
    loaded: false,
    travelDurationToBerth: '',
    rtaWindowDuration: '',
    laytimeBufferDuration: '',
    liveEtaAlertBufferDuration: '',
    liveEtaAlertDelayDuration: '',
    portOperatorEmails: '',
  };

  const [settings, setSettings] = useState(initSettings);

  if (error) {
    setAlert({ type: 'error', message: error });
  }

  if (!loading && !settings.loaded) {
    let obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'queue_travel_duration_to_berth'));
    let travelDurationToBerth = obj
      ? moment.duration(obj.queue_travel_duration_to_berth).format('HH:mm', { trim: false })
      : '00:00';
    obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'queue_rta_window_duration'));
    let rtaWindowDuration = obj
      ? moment.duration(obj.queue_rta_window_duration).format('HH:mm', { trim: false })
      : '00:00';
    obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'queue_laytime_buffer_duration'));
    let laytimeBufferDuration = obj
      ? moment.duration(obj.queue_laytime_buffer_duration).format('HH:mm', { trim: false })
      : '00:00';
    obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'queue_live_eta_alert_buffer_duration'));
    let liveEtaAlertBufferDuration = obj
      ? moment.duration(obj.queue_live_eta_alert_buffer_duration).format('HH:mm', { trim: false })
      : '00:00';
    obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'queue_live_eta_alert_delay_duration'));
    let liveEtaAlertDelayDuration = obj
      ? moment.duration(obj.queue_live_eta_alert_delay_duration).format('HH:mm', { trim: false })
      : '00:00';
    obj = data.find(element => Object.prototype.hasOwnProperty.call(element, 'port_operator_emails'));
    let portOperatorEmails = obj ? obj.port_operator_emails : '';

    let loaded = true;

    setSettings({
      loaded,
      travelDurationToBerth,
      rtaWindowDuration,
      laytimeBufferDuration,
      liveEtaAlertBufferDuration,
      liveEtaAlertDelayDuration,
      portOperatorEmails,
    });
  }

  const handleSave = async () => {
    setApiCallPending(true);
    let travelDurationToBerth = moment.duration(settings.travelDurationToBerth).toISOString();
    let rtaWindowDuration = moment.duration(settings.rtaWindowDuration).toISOString();
    let laytimeBufferDuration = moment.duration(settings.laytimeBufferDuration).toISOString();
    let liveEtaAlertBufferDuration = moment.duration(settings.liveEtaAlertBufferDuration).toISOString();
    let liveEtaAlertDelayDuration = moment.duration(settings.liveEtaAlertDelayDuration).toISOString();
    let portOperatorEmails = settings.portOperatorEmails;
    if (portOperatorEmails === '') {
      portOperatorEmails = 'empty';
    }

    try {
      await apiCall('put', `settings/queue_travel_duration_to_berth/${travelDurationToBerth}`);
      await apiCall('put', `settings/queue_rta_window_duration/${rtaWindowDuration}`);
      await apiCall('put', `settings/queue_laytime_buffer_duration/${laytimeBufferDuration}`);
      await apiCall('put', `settings/queue_live_eta_alert_buffer_duration/${liveEtaAlertBufferDuration}`);
      await apiCall('put', `settings/queue_live_eta_alert_delay_duration/${liveEtaAlertDelayDuration}`);
      await apiCall('put', `settings/port_operator_emails/${portOperatorEmails}`);
    } catch (e) {
      await fetchData(false);
      setSettings(initSettings);
      setApiCallPending(false);
      throw e;
    }

    await fetchData(false);
    setSettings(initSettings);
    setApiCallPending(false);
  };

  const handleCancel = () => {
    history.push('/queue-admin/admin-slot-reservations');
  };

  const handleChange = e => {
    settings[e.target.name] = e.target.value;
    setSettings({ ...settings });
  };

  return (
    <Layout>
      <Spin spinning={loading || apiCallPending}>
        <Page fullWidth title={t('Queue settings')}>
          <Input
            style={{ width: '500px' }}
            label={t(
              'Travel duration to berth (HH:mm). (How long does it take from ship to travel from outer port area to berth.)'
            )}
            name="travelDurationToBerth"
            value={settings.travelDurationToBerth}
            onChange={handleChange}
          />
          <Input
            style={{ width: '500px' }}
            label={t('RTA window duration (HH:mm). (RTA window offered to ship.)')}
            name="rtaWindowDuration"
            value={settings.rtaWindowDuration}
            onChange={handleChange}
          />
          <Input
            style={{ width: '500px' }}
            label={t(
              'Laytime buffer duration (HH:mm). (Time automatically added to laytime to compensate for possible delays.)'
            )}
            name="laytimeBufferDuration"
            value={settings.laytimeBufferDuration}
            onChange={handleChange}
          />
          <Input
            style={{ width: '500px' }}
            label={t(
              'Live ETA alert tolerance (HH:mm). (How much JIT ETA can be late compared to live ETA until ship is considered to be late.)'
            )}
            name="liveEtaAlertBufferDuration"
            value={settings.liveEtaAlertBufferDuration}
            onChange={handleChange}
          />
          <Input
            style={{ width: '500px' }}
            label={t('Live ETA alert delay (HH:mm). (How long ship can be late until alert is triggered.)')}
            name="liveEtaAlertDelayDuration"
            value={settings.liveEtaAlertDelayDuration}
            onChange={handleChange}
          />
          <Input
            style={{ width: '500px' }}
            label={t(
              'Port operator emails (comma separated list). (Live ETA alerts and automatic berth block shifts are sent to these emails.)'
            )}
            name="portOperatorEmails"
            value={settings.portOperatorEmails}
            onChange={handleChange}
          />
          <br></br>
          <Button link onClick={e => handleSave(e)}>
            {t('Send')}
          </Button>
          <br></br>
          <Button link onClick={e => handleCancel(e)}>
            {t('Cancel')}
          </Button>
        </Page>
      </Spin>
    </Layout>
  );
};

export default AdminQueueSettings;
