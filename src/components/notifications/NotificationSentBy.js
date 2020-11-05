import React from 'react';
import styled from 'styled-components';

const NotificationSender = styled.p`
  font-size: 0.8571rem;
  color: #747d7d;
  margin-bottom: 0;
`;

const NotificationSentBy = ({ sender, t }) => {
  return <NotificationSender>{t('Sent by {{sender}}', { sender: sender })}</NotificationSender>;
};

export default NotificationSentBy;
