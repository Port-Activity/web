import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Add } from '../../images/icons/add.svg';
import { ReactComponent as ArrowLeft } from '../../images/icons/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../images/icons/arrow-right.svg';
import { ReactComponent as BellAdd } from '../../images/icons/bell-add.svg';
import { ReactComponent as Bell } from '../../images/icons/bell.svg';
import { ReactComponent as CalendarClock } from '../../images/icons/calendar-clock.svg';
import { ReactComponent as Cellphone } from '../../images/icons/cellphone.svg';
import { ReactComponent as Check } from '../../images/icons/check.svg';
import { ReactComponent as CheckboxChecked } from '../../images/icons/checkbox-checked.svg';
import { ReactComponent as CheckboxUnchecked } from '../../images/icons/checkbox-unchecked.svg';
import { ReactComponent as ChevronLeft } from '../../images/icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from '../../images/icons/chevron-right.svg';
import { ReactComponent as ChevronUp } from '../../images/icons/chevron-up.svg';
import { ReactComponent as ChevronDown } from '../../images/icons/chevron-down.svg';
import { ReactComponent as Close } from '../../images/icons/close.svg';
import { ReactComponent as CommentAdd } from '../../images/icons/comment-add.svg';
import { ReactComponent as Comment } from '../../images/icons/comment.svg';
import { ReactComponent as Dots } from '../../images/icons/dots.svg';
import { ReactComponent as Download } from '../../images/icons/download.svg';
import { ReactComponent as Edit } from '../../images/icons/edit.svg';
import { ReactComponent as Email } from '../../images/icons/email.svg';
import { ReactComponent as Info } from '../../images/icons/info.svg';
import { ReactComponent as KeyAdd } from '../../images/icons/key-add.svg';
import { ReactComponent as Key } from '../../images/icons/key.svg';
import { ReactComponent as Lock } from '../../images/icons/lock.svg';
import { ReactComponent as Logistics } from '../../images/icons/logistics.svg';
import { ReactComponent as Logout } from '../../images/icons/logout.svg';
import { ReactComponent as MapAdd } from '../../images/icons/map-add.svg';
import { ReactComponent as MapClock } from '../../images/icons/map-clock.svg';
import { ReactComponent as Map } from '../../images/icons/map.svg';
import { ReactComponent as Marker } from '../../images/icons/marker.svg';
import { ReactComponent as Menu } from '../../images/icons/menu.svg';
import { ReactComponent as Module } from '../../images/icons/module.svg';
import { ReactComponent as Number } from '../../images/icons/number.svg';
import { ReactComponent as Pin } from '../../images/icons/pin.svg';
import { ReactComponent as Pinned } from '../../images/icons/pinned.svg';
import { ReactComponent as Plus } from '../../images/icons/plus.svg';
import { ReactComponent as Port } from '../../images/icons/port.svg';
import { ReactComponent as PortCall } from '../../images/icons/portcall.svg';
import { ReactComponent as Print } from '../../images/icons/print.svg';
import { ReactComponent as Profile } from '../../images/icons/profile.svg';
import { ReactComponent as RadioChecked } from '../../images/icons/radio-checked.svg';
import { ReactComponent as RadioUnchecked } from '../../images/icons/radio-unchecked.svg';
import { ReactComponent as Search } from '../../images/icons/search.svg';
import { ReactComponent as SelectArrow } from '../../images/icons/select-arrow.svg';
import { ReactComponent as Settings } from '../../images/icons/settings.svg';
import { ReactComponent as TextMessage } from '../../images/icons/text-message.svg';
import { ReactComponent as TimestampAdd } from '../../images/icons/timestamp-add.svg';
import { ReactComponent as ToggleOff } from '../../images/icons/toggle-off.svg';
import { ReactComponent as ToggleOn } from '../../images/icons/toggle-on.svg';
import { ReactComponent as Translate } from '../../images/icons/translate.svg';
import { ReactComponent as Trash } from '../../images/icons/trash.svg';
import { ReactComponent as UserAdd } from '../../images/icons/user-add.svg';
import { ReactComponent as UserCheck } from '../../images/icons/user-check.svg';
import { ReactComponent as Upload } from '../../images/icons/upload.svg';

const IconWrapper = styled.i`
  display: inline-block;
  position: relative;
  height: 1em;
  width: 1em;
  svg {
    display: inline-block;
    fill: currentColor;
    vertical-align: middle;
    text-align: center;
  }
`;

const Icon = ({ type, ...props }) => {
  switch (type) {
    case 'add':
      return (
        <IconWrapper {...props}>
          <Add />
        </IconWrapper>
      );
    case 'arrow-left':
      return (
        <IconWrapper {...props}>
          <ArrowLeft />
        </IconWrapper>
      );
    case 'arrow-right':
      return (
        <IconWrapper {...props}>
          <ArrowRight />
        </IconWrapper>
      );
    case 'bell-add':
      return (
        <IconWrapper {...props}>
          <BellAdd />
        </IconWrapper>
      );
    case 'bell':
      return (
        <IconWrapper {...props}>
          <Bell />
        </IconWrapper>
      );
    case 'calendar-clock':
      return (
        <IconWrapper {...props}>
          <CalendarClock />
        </IconWrapper>
      );
    case 'cellphone':
      return (
        <IconWrapper {...props}>
          <Cellphone />
        </IconWrapper>
      );
    case 'check':
      return (
        <IconWrapper {...props}>
          <Check />
        </IconWrapper>
      );
    case 'checkbox-checked':
      return (
        <IconWrapper {...props}>
          <CheckboxChecked />
        </IconWrapper>
      );
    case 'checkbox-unchecked':
      return (
        <IconWrapper {...props}>
          <CheckboxUnchecked />
        </IconWrapper>
      );
    case 'chevron-left':
      return (
        <IconWrapper {...props}>
          <ChevronLeft />
        </IconWrapper>
      );
    case 'chevron-right':
      return (
        <IconWrapper {...props}>
          <ChevronRight />
        </IconWrapper>
      );
    case 'chevron-up':
      return (
        <IconWrapper {...props}>
          <ChevronUp />
        </IconWrapper>
      );
    case 'chevron-down':
      return (
        <IconWrapper {...props}>
          <ChevronDown />
        </IconWrapper>
      );
    case 'close':
      return (
        <IconWrapper {...props}>
          <Close />
        </IconWrapper>
      );
    case 'comment-add':
      return (
        <IconWrapper {...props}>
          <CommentAdd />
        </IconWrapper>
      );
    case 'comment':
      return (
        <IconWrapper {...props}>
          <Comment />
        </IconWrapper>
      );
    case 'dots':
      return (
        <IconWrapper {...props}>
          <Dots />
        </IconWrapper>
      );
    case 'download':
      return (
        <IconWrapper {...props}>
          <Download />
        </IconWrapper>
      );
    case 'edit':
      return (
        <IconWrapper {...props}>
          <Edit />
        </IconWrapper>
      );
    case 'email':
      return (
        <IconWrapper {...props}>
          <Email />
        </IconWrapper>
      );
    case 'info':
      return (
        <IconWrapper {...props}>
          <Info />
        </IconWrapper>
      );
    case 'key-add':
      return (
        <IconWrapper {...props}>
          <KeyAdd />
        </IconWrapper>
      );
    case 'key':
      return (
        <IconWrapper {...props}>
          <Key />
        </IconWrapper>
      );
    case 'lock':
      return (
        <IconWrapper {...props}>
          <Lock />
        </IconWrapper>
      );
    case 'logistics':
      return (
        <IconWrapper {...props}>
          <Logistics />
        </IconWrapper>
      );
    case 'logout':
      return (
        <IconWrapper {...props}>
          <Logout />
        </IconWrapper>
      );
    case 'map-add':
      return (
        <IconWrapper {...props}>
          <MapAdd />
        </IconWrapper>
      );
    case 'map-clock':
      return (
        <IconWrapper {...props}>
          <MapClock />
        </IconWrapper>
      );
    case 'map':
      return (
        <IconWrapper {...props}>
          <Map />
        </IconWrapper>
      );
    case 'marker':
      return (
        <IconWrapper {...props}>
          <Marker />
        </IconWrapper>
      );
    case 'menu':
      return (
        <IconWrapper {...props}>
          <Menu />
        </IconWrapper>
      );
    case 'module':
      return (
        <IconWrapper {...props}>
          <Module />
        </IconWrapper>
      );
    case 'number':
      return (
        <IconWrapper {...props}>
          <Number />
        </IconWrapper>
      );
    case 'pin':
      return (
        <IconWrapper {...props}>
          <Pin />
        </IconWrapper>
      );
    case 'pinned':
      return (
        <IconWrapper {...props}>
          <Pinned />
        </IconWrapper>
      );
    case 'plus':
      return (
        <IconWrapper {...props}>
          <Plus />
        </IconWrapper>
      );
    case 'port':
      return (
        <IconWrapper {...props}>
          <Port />
        </IconWrapper>
      );
    case 'port-call':
      return (
        <IconWrapper {...props}>
          <PortCall />
        </IconWrapper>
      );
    case 'print':
      return (
        <IconWrapper {...props}>
          <Print />
        </IconWrapper>
      );
    case 'profile':
      return (
        <IconWrapper {...props}>
          <Profile />
        </IconWrapper>
      );
    case 'radio-checked':
      return (
        <IconWrapper {...props}>
          <RadioChecked />
        </IconWrapper>
      );
    case 'radio-unchecked':
      return (
        <IconWrapper {...props}>
          <RadioUnchecked />
        </IconWrapper>
      );
    case 'search':
      return (
        <IconWrapper {...props}>
          <Search />
        </IconWrapper>
      );
    case 'select-arrow':
      return (
        <IconWrapper {...props}>
          <SelectArrow />
        </IconWrapper>
      );
    case 'settings':
      return (
        <IconWrapper {...props}>
          <Settings />
        </IconWrapper>
      );
    case 'timestamp-add':
      return (
        <IconWrapper {...props}>
          <TimestampAdd />
        </IconWrapper>
      );
    case 'toggle-off':
      return (
        <IconWrapper {...props}>
          <ToggleOff />
        </IconWrapper>
      );
    case 'toggle-on':
      return (
        <IconWrapper {...props}>
          <ToggleOn />
        </IconWrapper>
      );
    case 'translate':
      return (
        <IconWrapper {...props}>
          <Translate />
        </IconWrapper>
      );
    case 'trash':
      return (
        <IconWrapper {...props}>
          <Trash />
        </IconWrapper>
      );
    case 'text-message':
      return (
        <IconWrapper {...props}>
          <TextMessage />
        </IconWrapper>
      );
    case 'user-add':
      return (
        <IconWrapper {...props}>
          <UserAdd />
        </IconWrapper>
      );
    case 'user-check':
      return (
        <IconWrapper {...props}>
          <UserCheck />
        </IconWrapper>
      );
    case 'upload':
      return (
        <IconWrapper {...props}>
          <Upload />
        </IconWrapper>
      );
    default:
      return null;
  }
};

export default Icon;
