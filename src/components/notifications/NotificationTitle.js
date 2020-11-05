import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import styled from 'styled-components';

const NotificationTime = styled(Moment)`
  color: #747d7d;
  font-weight: 700;
  font-size: 0.8571rem;
  font-style: italic;
  display: block;
  margin-bottom: 0;
`;

const NotificationMessage = styled.p`
  margin-bottom: 0;
`;

const NotificationTitle = ({ title }) => {
  const today = new Date();

  return (
    <>
      <NotificationTime format="HH:mm" date={today} />
      <NotificationMessage>{title}</NotificationMessage>
    </>
  );
};

export default NotificationTitle;
