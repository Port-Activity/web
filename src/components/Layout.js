import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import Menu from './Menu';
import PortName from './PortName';
import Hamburger from './Hamburger';
import Profile from './Profile';

const Header = styled.header`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  z-index: 5;
  height: 64px;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.primary};
  padding: 0 ${({ theme }) => theme.sizing.gap_medium};
  box-shadow: ${({ theme }) => theme.fx.box_shadow_sharp};
  svg {
    fill: ${({ theme }) => theme.color.white};
  }
  @media print {
    display: none;
  }
`;

const Content = styled.div`
  position: relative;
  overflow: hidden;
`;

const Layout = ({ children }) => {
  const { menuOpen, setMenuOpen, user } = useContext(UserContext);

  const username = `${user.first_name} ${user.last_name}`;

  return (
    <>
      <Header>
        <Hamburger onClick={() => setMenuOpen(!menuOpen)} />
        <PortName />
        <Profile username={username} />
      </Header>
      <Menu />
      <Content>{children}</Content>
    </>
  );
};

export default withRouter(Layout);
