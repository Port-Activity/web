import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { UserContext } from '../../context/UserContext';

import { Spin } from 'antd';

import Button from '../../components/ui/Button';
import Datepicker from '../../components/ui/Datepicker';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

const VisSendRta = props => {
  const [loading, setLoading] = useState(false);

  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();

  const { service_id } = props.match.params;

  let rta = '';
  let eta_min = '';
  let eta_max = '';

  const handleSave = async () => {
    setLoading(true);
    await apiCall('post', 'vis-send-rta', { vis_service_id: service_id, rta, eta_min, eta_max });
    history.push('/vis-vessels');
  };

  const handleCancel = () => {
    history.push('/vis-vessels');
  };

  const handleRtaChange = e => {
    let rtaMoment = moment(e);
    rtaMoment.set({ second: 0 });
    rta = rtaMoment.format('YYYY-MM-DDTHH:mm:ss+00:00');
  };

  const handleEtaMinChange = e => {
    let etaMinMoment = moment(e);
    etaMinMoment.set({ second: 0 });
    eta_min = etaMinMoment.format('YYYY-MM-DDTHH:mm:ss+00:00');
  };

  const handleEtaMaxChange = e => {
    let etaMaxMoment = moment(e);
    etaMaxMoment.set({ second: 0 });
    eta_max = etaMaxMoment.format('YYYY-MM-DDTHH:mm:ss+00:00');
  };

  return (
    <Layout>
      <Spin spinning={loading}>
        <Page title={service_id}>
          RTA in UTC<br></br>
          <Datepicker style={{ width: '500px' }} onChange={handleRtaChange} />
          <br></br>ETA min in UTC<br></br>
          <Datepicker style={{ width: '500px' }} onChange={handleEtaMinChange} />
          <br></br>ETA max in UTC<br></br>
          <Datepicker style={{ width: '500px' }} onChange={handleEtaMaxChange} />
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

export default VisSendRta;
