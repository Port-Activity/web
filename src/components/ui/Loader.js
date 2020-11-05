import React from 'react';
import styled, { keyframes } from 'styled-components';

import Logo from './Logo';

const loading = keyframes`
  0% {
    fill: ${({ theme }) => theme.color.primary};
    transform: rotate(0);
  }
  15% {
    transform: rotate(-5deg);
  }
  50% {
    fill: ${({ theme }) => theme.color.secondary};
    transform: rotate(180deg);
  }
  100% {
    fill: ${({ theme }) => theme.color.secondary};
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoader = styled.div`
  svg {
    height: 6rem;
    width: 6rem;
    animation: ${loading} 1s ease-in-out infinite;
  }
`;

const Loader = () => (
  <Wrapper>
    <StyledLoader>
      <Logo />
    </StyledLoader>
  </Wrapper>
);

export default Loader;
