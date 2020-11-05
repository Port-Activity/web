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

const VisSendTextMessage = props => {
  const [loading, setLoading] = useState(false);

  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();

  const { service_id } = props.match.params;

  const handleSave = async values => {
    setLoading(true);
    const { author, subject, body } = values;
    await apiCall('post', 'vis-text-messages', { vis_service_id: service_id, author, subject, body });
    history.push('/vis-vessels');
  };

  const handleCancel = e => {
    e.preventDefault();
    history.push('/vis-vessels');
  };

  const fields = ['author', 'subject', 'body'];
  const { values, handleChange, handleSubmit } = useForm(fields, handleSave);

  return (
    <Layout>
      <Spin spinning={loading}>
        <Page title={service_id}>
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

export default VisSendTextMessage;
