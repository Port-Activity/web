import React from 'react';
import styled from 'styled-components';

import Logo from '../ui/Logo';

const LogoWrapper = styled.div`
  position: absolute;
  margin-top: -130px;
  margin-left: -340px;
  background: #fff;
  svg {
    width: 400px;
    height: 400px;
    fill: ${({ theme }) => theme.color.grey_lighter};
    vertical-align: bottom;
  }
`;

const LoginLogo = () => (
  <LogoWrapper>
    <Logo />
  </LogoWrapper>
);

export default LoginLogo;
