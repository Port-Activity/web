import React, { useReducer, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import styled, { keyframes } from 'styled-components';

import { UserContext } from '../../context/UserContext';
import { NotificationContext } from '../../context/NotificationContext';

import {
  cancel,
  showAddTimestamp,
  showSendNotification,
  showRecommendTime,
  showRecommendTimeVis,
  showSendMessage,
} from '../../utils/actions';

import { TimestampContext } from '../../context/TimestampContext';

import { cardReducer } from '../../utils/reducers';

import { notification, message } from 'antd';

import Heading from '../ui/Heading';
import Icon from '../ui/Icon';
import Form from '../ui/Form';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Datepicker from '../ui/Datepicker';

import NotificationTitle from '../notifications/NotificationTitle';
import NotificationSentBy from '../notifications/NotificationSentBy';

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledCardActions = styled.div``;

const ActionButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.color.secondary};
  border-color: ${({ theme }) => theme.color.secondary};
  box-shadow: none;
  && {
    margin-bottom: ${({ theme }) => theme.sizing.gap};
  }
  &:hover {
    border-color: ${({ theme }) => theme.color.grey};
  }
`;

const ActionForm = styled(Form)`
  background: ${({ theme }) => theme.color.white};
  margin: 0 -${({ theme }) => theme.sizing.gap} ${({ theme }) => theme.sizing.gap};
  padding: 0 ${({ theme }) => theme.sizing.gap};
  animation: ${slideDown} 0.125s;
  select,
  input,
  textarea,
  span {
    width: 100%;
  }
`;

const ActionButtons = styled.div`
  text-align: right;
  margin-top: ${({ theme }) => theme.sizing.gap};
  button {
    margin-right: ${({ theme }) => theme.sizing.gap};
    &:last-child {
      margin-right: 0;
    }
  }
`;

const ActionHeader = styled(Heading)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.secondary};
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.05em;
  padding: ${({ theme }) => theme.sizing.gap};
  margin: 0 calc(-${({ theme }) => theme.sizing.gap} - 1px) ${({ theme }) => theme.sizing.gap}
    calc(-${({ theme }) => theme.sizing.gap} - 1px);
  i {
    width: 20px;
    height: 20px;
    margin-right: ${({ theme }) => theme.sizing.gap_tiny};
    fill: currentColor;
    top: -1px;
  }
`;

const RtaLocation = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
`;

const RtaLocationLabel = styled.p`
  font-size: 0.8571rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
`;

const RtaLocationCoords = styled.p``;

const UTCTime = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.color.grey};
  margin-top: ${({ theme }) => theme.sizing.gap_small};
  margin-bottom: 0;
  padding-left: 0.9rem;
`;

const ActionWrapper = styled.div`
  &:last-of-type {
    margin-bottom: 0;
    form {
      margin-bottom: 0;
    }
  }
`;

const CardActions = ({ portCallId, imo, vesselName, setOpen, isVis, visServiceId, ...props }) => {
  const { apiCall, namespace, portName, user, rtaPointCoordinates } = useContext(UserContext);
  const { timestampDefinitions } = useContext(TimestampContext);
  const { apiSendNotification } = useContext(NotificationContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const initCard = {
    showAddTimestamp: false,
    showSendNotification: false,
    showRecommendTime: false,
    showRecommendTimeVis: false,
    showSendMessage: false,
  };

  const [state, dispatch] = useReducer(cardReducer, initCard);

  const [notificationTitle, setNotificationTitle] = useState(undefined);

  const initRecommendedTime = {
    port_call_id: portCallId,
    port: portName,
    imo: imo,
    rta: undefined,
    eta_min: undefined,
    eta_max: undefined,
    payload: {
      email: user.email,
    },
  };

  const initRecommendedTimeVis = {
    port_call_id: portCallId,
    port: portName,
    imo: imo,
    rta: undefined,
    eta_min: undefined,
    eta_max: undefined,
    vis_service_id: visServiceId,
    payload: {
      email: user.email,
    },
  };

  const [recommendedTime, setRecommendedTime] = useState(initRecommendedTime);
  const [recommendedTimeVis, setRecommendedTimeVis] = useState(initRecommendedTimeVis);

  const initTimestamp = {
    imo: imo,
    vessel_name: vesselName,
    time_type: undefined,
    state: undefined,
    time: undefined,
    payload: {},
  };

  const [timestamp, setTimestamp] = useState(initTimestamp);

  const initVisMessage = {
    imo: imo,
    subject: undefined,
    body: undefined,
  };

  const [visMessage, setVisMessage] = useState(initVisMessage);

  const timestampOptions = timestampDefinitions
    .map(def => ({
      id: def.id,
      value: def.name,
      label: t(def.name),
      title: def.name,
    }))
    .sort((e1, e2) => e1.label > e2.label);

  timestampOptions.unshift({
    key: 0,
    value: '',
    label: t('Select timestamp type'),
  });

  const sender = t('{{username}} (Port of {{portname}})', { portname: portName, username: user.email });

  const handleTimestampChange = e => {
    if (e && e.target) {
      const result = timestampDefinitions.filter(obj => obj.name === e.target.value).pop();
      setTimestamp({
        ...timestamp,
        time_type: result && result.time_type,
        state: result && result.state,
      });
    } else if (e) {
      setTimestamp({
        ...timestamp,
        time: moment(e)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss+00:00'),
      });
    }
  };

  const handleNotificationChange = e => {
    setNotificationTitle(e.target.value);
  };

  const handleRtaChange = e => {
    if (e) {
      setRecommendedTime({
        ...recommendedTime,
        rta: moment.utc(e).format('YYYY-MM-DDTHH:mm:ss+00:00'),
        eta_min: moment(e)
          .utc()
          .subtract(30, 'minutes')
          .format('YYYY-MM-DDTHH:mm:ss+00:00'),
        eta_max: moment(e)
          .utc()
          .add(30, 'minutes')
          .format('YYYY-MM-DDTHH:mm:ss+00:00'),
      });
    }
  };

  const handleRtaVisChange = e => {
    if (e) {
      setRecommendedTimeVis({
        ...recommendedTimeVis,
        rta: moment.utc(e).format('YYYY-MM-DDTHH:mm:ss+00:00'),
        eta_min: moment(e)
          .utc()
          .subtract(30, 'minutes')
          .format('YYYY-MM-DDTHH:mm:ss+00:00'),
        eta_max: moment(e)
          .utc()
          .add(30, 'minutes')
          .format('YYYY-MM-DDTHH:mm:ss+00:00'),
      });
    }
  };

  const handleVisMessageChange = e => {
    if (e) {
      setVisMessage({
        ...visMessage,
        [e.target.name]: e.target.value,
      });
    }
  };

  const sendNotification = e => {
    e.preventDefault();
    if (notificationTitle && imo) {
      apiSendNotification('ship', notificationTitle, imo);
      notification.open({
        message: <NotificationTitle title={notificationTitle} />,
        description: <NotificationSentBy sender={sender} t={t} />,
        duration: 5,
        placement: 'bottomRight',
        closeIcon: <Icon type="close" />,
      });
      dispatch(cancel());
      setOpen(false);
    }
    setNotificationTitle(undefined);
  };

  const sendTimestamp = async e => {
    e.preventDefault();
    const result = await apiCall('post', 'timestamps', timestamp);
    setTimestamp(initTimestamp);
    if (result && result.status === 200) {
      dispatch(cancel());
      setOpen(false);
      return message.success(t('Timestamp was sent successfully'), 4);
    }
    dispatch(cancel());
    return message.error(t(result.data.error), 4);
  };

  const sendRta = async e => {
    e.preventDefault();
    const result = await apiCall('post', 'rta-web-form', recommendedTime);
    setRecommendedTime(initRecommendedTime);
    if (result && result.status === 200) {
      dispatch(cancel());
      setOpen(false);
      return message.success(t('Recommended time was sent successfully'), 4);
    }
    dispatch(cancel());
    return message.error(t(result.data.error), 4);
  };

  const sendRtaVis = async e => {
    e.preventDefault();
    const result = await apiCall('post', 'vis-send-rta', recommendedTimeVis);
    setRecommendedTimeVis(initRecommendedTimeVis);
    if (result && result.status === 200) {
      dispatch(cancel());
      setOpen(false);
      return message.success(t('Recommended time was sent successfully'), 4);
    }
    dispatch(cancel());
    return message.error(t(result.data.error), 4);
  };

  const sendMessage = async e => {
    e.preventDefault();
    const result = await apiCall('post', 'vis-text-messages-with-imo', visMessage);
    setRecommendedTimeVis(initRecommendedTimeVis);
    if (result && result.status === 200) {
      dispatch(cancel());
      setOpen(false);
      return message.success(t('STM text message was sent successfully'), 4);
    }
    dispatch(cancel());
    return message.error(t(result.data.error), 4);
  };

  const handleCancel = () => {
    setTimestamp(initTimestamp);
    setRecommendedTime(initRecommendedTime);
    setRecommendedTimeVis(initRecommendedTimeVis);
    setVisMessage(initVisMessage);
    dispatch(cancel());
  };

  return (
    <StyledCardActions {...props}>
      {user.permissions.includes('add_manual_timestamp') && (
        <ActionWrapper>
          {!state.showAddTimestamp ? (
            <ActionButton outline onClick={() => dispatch(showAddTimestamp())}>
              <Icon type="timestamp-add" />
              {t('Add timestamp')}
            </ActionButton>
          ) : (
            <ActionForm onSubmit={sendTimestamp}>
              <ActionHeader h4>
                <Icon type="timestamp-add" />
                {t('Add timestamp')}
              </ActionHeader>
              <Select
                label={t('Timestamp type')}
                name="type"
                options={timestampOptions}
                onChange={handleTimestampChange}
              />
              <Label>{t('Date and time')}</Label>
              <Datepicker onChange={handleTimestampChange} />
              {timestamp.time && <UTCTime>{timestamp.time} UTC</UTCTime>}
              <ActionButtons>
                <Button disabled={typeof timestamp.time === 'undefined'} link>
                  {t('Add new')}
                </Button>
                <Button link onClick={handleCancel}>
                  {t('Cancel')}
                </Button>
              </ActionButtons>
            </ActionForm>
          )}
        </ActionWrapper>
      )}
      {user.permissions.includes('send_push_notification') && (
        <ActionWrapper>
          {!state.showSendNotification ? (
            <ActionButton outline onClick={() => dispatch(showSendNotification())}>
              <Icon type="bell-add" />
              {t('Send notification')}
            </ActionButton>
          ) : (
            <ActionForm onSubmit={sendNotification}>
              <ActionHeader h4>
                <Icon type="bell-add" /> {t('Send notification')}
              </ActionHeader>
              <Textarea
                label={t('Notification message')}
                value={notificationTitle}
                onChange={handleNotificationChange}
              />
              <ActionButtons>
                <Button disabled={notificationTitle === undefined} link>
                  {t('Send')}
                </Button>
                <Button link onClick={handleCancel}>
                  {t('Cancel')}
                </Button>
              </ActionButtons>
            </ActionForm>
          )}
        </ActionWrapper>
      )}
      {user.permissions.includes('send_rta_web_form') && (
        <ActionWrapper>
          {!state.showRecommendTime ? (
            <ActionButton outline onClick={() => dispatch(showRecommendTime())}>
              <Icon type="map-clock" />
              {t('Recommend time')}
            </ActionButton>
          ) : (
            <ActionForm onSubmit={sendRta}>
              <ActionHeader h4>
                <Icon type="map-clock" /> {t('Recommend time')}
              </ActionHeader>
              <RtaLocation>
                <RtaLocationLabel>{t('Location')}</RtaLocationLabel>
                <RtaLocationCoords>{rtaPointCoordinates}</RtaLocationCoords>
              </RtaLocation>
              <Datepicker onChange={handleRtaChange} />
              {recommendedTime.rta && <UTCTime>{recommendedTime.rta} UTC</UTCTime>}
              <ActionButtons>
                <Button disabled={recommendedTime.rta === undefined} link>
                  {t('Send')}
                </Button>
                <Button link onClick={handleCancel}>
                  {t('Cancel')}
                </Button>
              </ActionButtons>
            </ActionForm>
          )}
        </ActionWrapper>
      )}
      {isVis && user.permissions.includes('send_vis_rta') && (
        <ActionWrapper>
          {!state.showRecommendTimeVis ? (
            <ActionButton outline onClick={() => dispatch(showRecommendTimeVis())}>
              <Icon type="map-clock" />
              {t('Recommend time (STM)')}
            </ActionButton>
          ) : (
            <ActionForm onSubmit={sendRtaVis}>
              <ActionHeader h4>
                <Icon type="map-clock" /> {t('Recommend time (STM)')}
              </ActionHeader>
              <RtaLocation>
                <RtaLocationLabel>{t('Location')}</RtaLocationLabel>
                <RtaLocationCoords>{rtaPointCoordinates}</RtaLocationCoords>
              </RtaLocation>
              <Datepicker onChange={handleRtaVisChange} />
              {recommendedTimeVis.rta && <UTCTime>{recommendedTimeVis.rta} UTC</UTCTime>}
              <ActionButtons>
                <Button disabled={recommendedTimeVis.rta === undefined} link>
                  {t('Send')}
                </Button>
                <Button link onClick={handleCancel}>
                  {t('Cancel')}
                </Button>
              </ActionButtons>
            </ActionForm>
          )}
        </ActionWrapper>
      )}
      {isVis && user.permissions.includes('send_vis_text_message') && (
        <ActionWrapper>
          {!state.showSendMessage ? (
            <ActionButton outline onClick={() => dispatch(showSendMessage())}>
              <Icon type="text-message" />
              {t('Send text message (STM)')}
            </ActionButton>
          ) : (
            <ActionForm style={{ marginBottom: '-1rem' }} onSubmit={sendMessage}>
              <ActionHeader h4>
                <Icon type="text-message" /> {t('Send text message (STM)')}
              </ActionHeader>
              <Input label={t('Subject')} name="subject" onChange={handleVisMessageChange} />
              <Textarea label={t('Body')} name="body" onChange={handleVisMessageChange} />
              <ActionButtons>
                <Button disabled={visMessage.subject === undefined || visMessage.body === undefined} link>
                  {t('Send')}
                </Button>
                <Button link onClick={handleCancel}>
                  {t('Cancel')}
                </Button>
              </ActionButtons>
            </ActionForm>
          )}
        </ActionWrapper>
      )}
    </StyledCardActions>
  );
};

export default CardActions;
