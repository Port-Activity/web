import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';

import { Spin } from 'antd';

import useForm from '../../hooks/useForm';

import Form from '../../components/ui/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import Layout from '../../components/Layout';
import Page from '../../components/ui/Page';

const VisServiceFind = () => {
  const [loading, setLoading] = useState(false);

  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();

  const handleSave = async values => {
    setLoading(true);
    let params = [];
    const { imo, service_id } = values;

    if (imo !== '') {
      params['imo'] = parseInt(imo);
    }

    if (service_id !== '') {
      params['service_id'] = service_id;
    }

    await apiCall('get', 'vis-services', params);
    history.push('/vis-vessels');
  };

  const handleCancel = e => {
    e.preventDefault();
    history.push('/vis-vessels');
  };

  const fields = ['imo', 'service_id'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave);

  return (
    <Layout>
      <Spin spinning={loading}>
        <Page title="Find VIS Services">
          <Form onSubmit={handleSubmit}>
            {fields.map(field => (
              <Input
                style={{ width: '500px' }}
                label={field.replace(/_/g, ' ')}
                key={field}
                name={field}
                field={field}
                value={values.field}
                onChange={handleChange}
              />
            ))}
            <Button link>{t('Send')}</Button>
            <br></br>
            <Button link onClick={e => handleCancel(e)}>
              {t('Cancel')}
            </Button>
          </Form>
        </Page>
      </Spin>
    </Layout>
  );
};

export default VisServiceFind;
