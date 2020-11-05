import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import 'moment-timezone';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

import useApi from '../../hooks/useApi';
import useSocket from '../../hooks/useSocket';

import { LOGISTICS_LIMIT } from '../../utils/constants';

import { Timeline, message } from 'antd';

import Icon from '../ui/Icon';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.sizing.gap_small} ${({ theme }) => theme.sizing.gap};
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  border-radius: ${({ theme }) => theme.style.border_radius};
  width: 180px;
  height: 64px;
  .ant-timeline-item-right & {
    float: right;
    margin-right: -244px;
    margin-top: -64px;
  }
  .ant-timeline-item-left & {
    float: left;
    margin-left: -244px;
    margin-top: -64px;
  }
`;

const Direction = styled.p`
  font-size: ${({ theme }) => theme.text.small};
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0;
`;

const RelativeTime = styled(Moment)`
  display: block;
`;

const Time = styled(Moment)`
  display: block;
  color: ${({ theme }) => theme.color.grey};
  font-style: italic;
`;

const TruckInfo = styled.dl`
  display: flex;
  flex-wrap: wrap;
  font-size: ${({ theme }) => theme.text.small};
  margin: 0;
  text-align: left;
`;

const Term = styled.dt`
  font-weight: 700;
  text-transform: uppercase;
  width: 64%;
  white-space: nowrap;
`;

const Description = styled.dd`
  color: ${({ theme }) => theme.color.grey};
  margin-left: auto;
  width: 36%;
  margin-bottom: 0;
`;

const LogisticsTimeline = () => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const [trucks, setTrucks] = useState([]);

  const { loading, data, error, fetchData } = useApi('get', `logistics-timestamps/${LOGISTICS_LIMIT}`, {});

  useEffect(() => {
    const reversedData = data && data.reverse();
    setTrucks(reversedData);
  }, [data]);

  const getLogistics = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useSocket('logistics-changed', getLogistics);

  if (error) {
    message.error(error, 4);
  }

  return (
    <Timeline mode="alternate" pending={loading} reverse={true}>
      {trucks &&
        trucks.map(item => (
          <Timeline.Item
            key={item.external_id}
            dot={<Icon type="logistics" />}
            position={item.direction === 'Out' ? 'left' : 'right'}
          >
            <Direction>{item.direction === 'Out' ? t('Departed') : t('Arrived')}</Direction>
            <RelativeTime fromNow date={item.time} />
            <Time format="YYYY-MM-DD HH:mm:SSZ" date={item.time} />
            <Wrapper>
              <TruckInfo>
                <Term>{t('Nationality')}</Term>
                <Description>
                  {item.front_license_plates.length > 0 ? item.front_license_plates[0].nationality : t('N/A')}
                </Description>
                <Term>{t('Reg No.')}</Term>
                <Description>
                  {item.front_license_plates.length > 0
                    ? item.front_license_plates[0].number.replace(/(^\w{3})(\d{3})/, '$1-$2')
                    : t('N/A')}
                </Description>
              </TruckInfo>
            </Wrapper>
          </Timeline.Item>
        ))}
    </Timeline>
  );
};

export default LogisticsTimeline;
