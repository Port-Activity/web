import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment-timezone';
import styled, { keyframes } from 'styled-components';

import { UserContext } from '../../context/UserContext';

import TimestampTooltip from './TimestampTooltip';
import { TIME_FORMAT } from '../../utils/constants';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledTimestamp = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.sizing.gap_small} ${({ theme }) => theme.sizing.gap};
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
  animation: ${fadeIn} 0.125s;
  font-weight: ${props => (props.new ? 700 : 500)};
  &:before {
    content: '';
    position: absolute;
    left: -16px;
    top: 50%;
    margin-top: -4px;
    background: ${({ theme }) => theme.color.primary};
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const TypeState = styled.span`
  margin-right: ${({ theme }) => theme.sizing.gap_tiny};
`;

const RelativeTime = styled(Moment)`
  display: block;
  font-size: ${({ theme }) => theme.text.small};
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
`;

const Time = styled(Moment)`
  display: block;
  font-style: italic;
  font-size: ${({ theme }) => theme.text.small};
  margin-bottom: 0;
`;

const Timestamp = ({ data, ...props }) => {
  const { namespace } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const [isNew, setIsNew] = useState(false);

  const time_state = data.state.replace(/_/g, ' ');

  useEffect(() => {
    if (data.time) {
      const createdAt = moment(data.created_at);
      if (createdAt.isBefore(moment().add(10, 'minutes')) && createdAt.isAfter(moment().subtract(10, 'minutes'))) {
        setIsNew(true);
      }
    }
  }, [data]);

  return (
    <StyledTimestamp new={isNew} {...props}>
      <TimestampTooltip data={data}>
        <TypeState>{t(`${data.time_type} ${time_state}`)}</TypeState>
        {data.time && <RelativeTime fromNow date={data.time} />}
        {data.time && <Time format={TIME_FORMAT} date={data.time} />}
      </TimestampTooltip>
    </StyledTimestamp>
  );
};

export default Timestamp;
