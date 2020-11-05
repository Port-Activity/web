import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
import styled, { css } from 'styled-components';

import { UserContext } from '../../context/UserContext';
import { TimestampContext } from '../../context/TimestampContext';

import { Tooltip } from 'antd';

import Heading from '../ui/Heading';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

import ShipRoute from './ShipRoute';
import ShipInfo from './ShipInfo';
import ShipBadges from './ShipBadges';
import CardActions from './CardActions';
import CardInfo from './CardInfo';
import { TIME_FORMAT } from '../../utils/constants';

function createCSS({ totalVessels }) {
  let styles = '';
  for (let i = 1; i <= totalVessels + 1; i++) {
    styles += `
          &:nth-child(${i}) {
            grid-column: ${i};
            grid-row: 1;
            -ms-grid-column: ${i};
            -ms-grid-row: 1;
          }
       `;
  }
  return css`
    ${styles}
  `;
}

const CardWrapper = styled.div`
  position: relative;
  z-index: 15;
  padding: ${({ theme }) => theme.sizing.gap_small} ${({ theme }) => theme.sizing.gap};
  background: ${props => (props.pinned ? props.theme.color.highlight : props.theme.color.white)};
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  border-radius: ${({ theme }) => theme.style.border_radius};
  border: 1px solid transparent;
  width: 300px;
  min-height: 180px;
  margin-right: ${({ theme }) => theme.sizing.gap_medium};
  transition: ${({ theme }) => theme.transition.cubic(0.2)};
  ${props => {
    if (props.open) {
      return `
        box-shadow: none;
        border-color: ${props.theme.color.grey_light};
        ${ToggleCard} {
          opacity: 1;
          pointer-events: auto;
        }
      `;
    } else {
      return `
        &:hover {
          transform: scale(1.03);
          box-shadow: ${props.theme.fx.box_shadow_soft};
        }
      `;
    }
  }}
  ${createCSS}
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const CardInnerWrap = styled.div``;

const ShipName = styled(Heading)`
  margin-bottom: 0;
`;

const ShipIMO = styled.p`
  font-size: ${({ theme }) => theme.text.small};
  color: ${({ theme }) => theme.color.grey};
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.cubic(0.2)};
  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const NextEvent = styled.p`
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const NextEventTitle = styled.span`
  margin-right: ${({ theme }) => theme.sizing.gap_tiny};
`;

const NextEventTimestamp = styled(Moment)``;

const Pin = styled(Icon)`
  opacity: ${props => (props.pinned ? 1 : 0)};
  pointer-events: ${props => (props.pinned ? 'auto' : 'none')};
  position: relative;
  z-index: 5;
  cursor: pointer;
  float: right;
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.color.black};
  margin-top: ${({ theme }) => theme.sizing.gap_tiny};
  transition: ${({ theme }) => theme.transition.cubic(0.2)};
  ${CardWrapper}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`;

const Nationality = styled.sup`
  margin-left: ${({ theme }) => theme.sizing.gap_tiny};
  font-size: ${({ theme }) => theme.text.small};
  user-select: none;
`;

const Placeholder = styled.p`
  color: ${({ theme }) => theme.color.grey};
  font-weight: 700;
  font-style: italic;
  margin-bottom: 0;
`;

const ToggleCard = styled(Button)`
  display: ${props => (props.show ? 'inline-block' : 'none')};
  color: ${props => (props.open ? props.theme.color.grey : props.theme.color.secondary)};
  width: 100%;
  text-align: right;
  opacity: 0;
  pointer-events: none;
  margin: ${({ theme }) => theme.sizing.gap_small} 0 0 0;
  ${props => {
    if (props.open) {
      return `
        &:hover {
          color: ${props.theme.color.grey};
        }
      `;
    }
  }}
  i {
    width: 1.1em;
    height: 1.1em;
    top: -1px;
    margin: 0 ${({ theme }) => theme.sizing.gap_small} 0 0;
    svg {
      transition: transform 0.125s ease-in;
      transform: ${props => (props.open ? 'rotate(180deg)' : 'none')};
    }
  }
  ${CardWrapper}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`;

const Card = ({ data, ...props }) => {
  const { apiCall, namespace, user } = useContext(UserContext);
  const { pinnedVessels } = useContext(TimestampContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const history = useHistory();

  const {
    id,
    imo,
    mmsi,
    call_sign,
    vessel_name,
    nationality,
    from_port,
    to_port,
    next_port,
    // first_eta,
    // current_eta,
    // planned_eta,
    // first_etd,
    // current_etd,
    // planned_etd,
    // ata,
    // atd,
    // rta,
    is_vis,
    vis_service_id,
    type,
    status,
    loa,
    beam,
    draft,
    net_weight,
    gross_weight,
    badges,
    next_event,
  } = data;

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinnedVessels.includes(imo)) {
      setPinned(true);
    } else {
      setPinned(false);
    }
  }, [imo, pinnedVessels, badges, is_vis]);

  const handlePin = async () => {
    let newPinnedVessels = Array.from(pinnedVessels);
    const index = newPinnedVessels.indexOf(imo);
    if (index !== -1) {
      newPinnedVessels.splice(index, 1);
    } else {
      newPinnedVessels.push(imo);
    }
    if (pinned) {
      await apiCall('put', 'pinned-vessel-ids', { vessel_ids: newPinnedVessels });
      setPinned(false);
    } else {
      await apiCall('put', 'pinned-vessel-ids', { vessel_ids: newPinnedVessels });
      setPinned(true);
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const hasPermissions =
    user.permissions.includes('add_manual_timestamp') ||
    user.permissions.includes('send_push_notification') ||
    user.permissions.includes('send_rta_web_form') ||
    user.permissions.includes('send_vis_message')
      ? true
      : false;

  const hasData =
    mmsi || call_sign || net_weight || gross_weight || type || status || loa || beam || draft ? true : false;

  return (
    <CardWrapper open={open} pinned={pinned} {...props}>
      <CardInner>
        <CardInnerWrap>
          <Tooltip placement="left" title={t('Pin to filter notifications')}>
            <Pin pinned={pinned} type={pinned ? 'pinned' : 'pin'} onClick={handlePin} />
          </Tooltip>
          <ShipBadges badges={badges} />
          <ShipName h3>
            {vessel_name}
            <Nationality>{nationality}</Nationality>
          </ShipName>
          <ShipIMO onClick={() => history.push(`/admin/port-calls/${id}`)}>IMO {imo}</ShipIMO>
          {from_port ? (
            <ShipRoute
              from={from_port ? from_port : t('Unknown port')}
              to={to_port ? to_port : t('Unknown port')}
              next={next_port ? next_port : t('Unknown port')}
            />
          ) : (
            <Placeholder>{t('Trip details unknown')}</Placeholder>
          )}
          {next_event && next_event.ts && next_event.title ? (
            <NextEvent>
              <NextEventTitle>{next_event.title}</NextEventTitle>
              <NextEventTimestamp format={TIME_FORMAT} date={next_event.ts} />
            </NextEvent>
          ) : (
            <Placeholder>{t('ETA unknown')}</Placeholder>
          )}
        </CardInnerWrap>
        <ToggleCard link show={hasPermissions || hasData} open={open} onClick={handleClick}>
          <Icon type="chevron-down" />
          {open ? t('Show less') : t('Show more')}
        </ToggleCard>
      </CardInner>
      <CardInfo show={open}>
        <ShipInfo
          hasData={hasData}
          mmsi={mmsi}
          call_sign={call_sign}
          net_weight={net_weight}
          gross_weight={gross_weight}
          type={type}
          status={status}
          loa={loa}
          beam={beam}
          draft={draft}
        />
        <CardActions
          portCallId={id}
          pinned={pinned}
          imo={imo}
          setOpen={setOpen}
          vesselName={vessel_name}
          isVis={is_vis}
          visServiceId={vis_service_id}
        />
      </CardInfo>
    </CardWrapper>
  );
};

export default Card;
