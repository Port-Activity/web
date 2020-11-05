import React, { useContext } from 'react';
import styled from 'styled-components';

import { NotificationContext } from '../context/NotificationContext';

import { Badge } from 'antd';

import Icon from './ui/Icon';

const BurgerWrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.sizing.gap_small};
  width: 42px;
  @media (min-width: 768px) {
    margin-right: ${({ theme }) => theme.sizing.gap};
  }
  i {
    width: 42px;
    height: 32px;
    svg {
      fill: ${({ theme }) => theme.color.white};
    }
  }
`;

const NotificationsBadge = styled(Badge)`
  && {
    position: absolute;
    z-index: 50;
    top: -${({ theme }) => theme.sizing.gap_small};
    right: 0;
  }
  .ant-badge-count {
    box-shadow: none;
  }
`;

const Hamburger = props => {
  const { notificationCount } = useContext(NotificationContext);

  return (
    <BurgerWrapper {...props}>
      <NotificationsBadge count={notificationCount} />
      <Icon type="menu" />
    </BurgerWrapper>
  );
};

export default Hamburger;
