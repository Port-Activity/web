import React from 'react';
import styled from 'styled-components';

import BuildVersion from '../BuildVersion';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
`;

const LoginVersion = styled(BuildVersion)`
  @media (min-width: 768px) {
    position: absolute;
    right: ${({ theme }) => theme.sizing.gap_medium};
    bottom: ${({ theme }) => theme.sizing.gap};
  }
`;

const LoginWrapper = props => (
  <StyledWrapper {...props}>
    {props.children}
    <LoginVersion />
  </StyledWrapper>
);

export default LoginWrapper;
