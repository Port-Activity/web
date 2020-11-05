import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import useToggle from '../../hooks/useToggle';

import { UserContext } from '../../context/UserContext';
import { NotificationContext } from '../../context/NotificationContext';

import { notification } from 'antd';

import Button from '../ui/Button';
import Form from '../ui/Form';
import Textarea from '../ui/Textarea';
import Icon from '../ui/Icon';

import PageAction from '../page/PageAction';
import PageActionForm from '../page/PageActionForm';

import NotificationTitle from './NotificationTitle';
import NotificationSentBy from './NotificationSentBy';

const FormActions = styled.div`
  text-align: right;
  button {
    margin-bottom: 0;
  }
`;

const NotificationActions = () => {
  const { namespace, portName, user } = useContext(UserContext);
  const { apiSendNotification, loading } = useContext(NotificationContext);
  const { t } = useTranslation(namespace);

  const actionsRef = useRef();
  const [actions, showActions] = useToggle(false, actionsRef);
  const [notificationTitle, setNotificationTitle] = useState(undefined);

  const sender = t('{{username}} (Port of {{portname}})', { portname: portName, username: user.email });

  const handleCancel = e => {
    e.preventDefault();
    setNotificationTitle(undefined);
    showActions(false);
  };

  const openNotification = e => {
    e.preventDefault();
    apiSendNotification('port', notificationTitle, '');
    notification.open({
      message: <NotificationTitle title={notificationTitle} />,
      description: <NotificationSentBy sender={sender} t={t} />,
      duration: 5,
      placement: 'bottomRight',
      closeIcon: <Icon type="close" />,
    });
    setNotificationTitle(undefined);
    showActions(false);
  };

  const handleChange = e => {
    setNotificationTitle(e.target.value);
  };

  return (
    <div ref={actionsRef}>
      <PageAction>
        <Button disabled={loading} onClick={() => showActions(true)}>
          <Icon type="bell-add" />
          {t('Send port notification')}
        </Button>
        <PageActionForm title={t('Send port notification')} icon="bell-add" show={actions}>
          <Form autoComplete="off" onSubmit={openNotification}>
            <Textarea label={t('Notification message')} value={notificationTitle} onChange={handleChange} />
            <FormActions>
              <Button disabled={notificationTitle === undefined} link>
                {t('Send notification')}
              </Button>
              <Button link onClick={e => handleCancel(e)}>
                {t('Cancel')}
              </Button>
            </FormActions>
          </Form>
        </PageActionForm>
      </PageAction>
    </div>
  );
};

export default NotificationActions;
