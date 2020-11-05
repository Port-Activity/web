import React, { useContext } from 'react';
import moment from 'moment';
import 'moment-timezone';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../context/UserContext';

import { Tooltip } from 'antd';
import Paragraph from '../ui/Paragraph';
import { TIME_FORMAT } from '../../utils/constants';

const Source = styled.p`
  font-weight: 700;
`;

const Description = styled(Paragraph)`
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
`;

const Time = styled('div')`
  display: block;
  font-style: italic;
  font-size: ${({ theme }) => theme.text.small};
  margin-bottom: 0;
`;

const TimestampTooltip = ({ data, children, ...props }) => {
  const { namespace } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const { source, created_at } = data;

  const TooltipTitle = () => (
    <>
      <Source>{source ? t('Timestamp received from {{source}}', { source: source }) : null}</Source>
      <Description>{t(`${data.time_type} ${data.state} description.`)}</Description>
      {created_at ? <Time>{t('Received at {{time}}', { time: moment(created_at).format(TIME_FORMAT) })}</Time> : null}
    </>
  );

  return (
    <Tooltip title={<TooltipTitle />} {...props}>
      {children}
    </Tooltip>
  );
};

export default TimestampTooltip;
