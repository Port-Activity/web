import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import 'moment-timezone';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';
import { TIME_FORMAT } from '../../utils/constants';

const StyledNotification = styled.div``;

const Time = styled(Moment)`
  display: block;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const Title = styled.p`
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const SentBy = styled.p`
  margin-bottom: 0;
  color: ${({ theme }) => theme.color.grey};
`;

const NotificationListItem = ({ data }) => {
  const { namespace, portName } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const { created_at, message, type, sender, ship, ship_imo } = data;

  let name = '';

  if (type === 'ship') {
    name = (ship && ship.vessel_name) || `IMO #${ship_imo}`;
  } else {
    name = t('Port of {{portname}}', { portname: portName });
  }

  return (
    <StyledNotification>
      <Time format={TIME_FORMAT} date={created_at} />
      <Title>{message}</Title>
      <SentBy>{t('Sent by {{sender}} ({{name}})', { sender: sender.email, name: name })}</SentBy>
    </StyledNotification>
  );
};

export default NotificationListItem;
