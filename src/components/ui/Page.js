import React from 'react';
import styled from 'styled-components';

import Heading from '../../components/ui/Heading';

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.color.grey_lighter};
  padding: ${({ theme }) => theme.sizing.gap_big};
  @media print {
    background: white;
    padding: 0;
    min-height: 0;
  }
`;

const Content = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.style.border_radius};
  background: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.sizing.gap_big};
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  margin-bottom: ${({ theme }) => theme.sizing.gap};
  min-height: 240px;
  max-width: ${props => (props.fullWidth ? '100%' : '80vw')};
  @media print {
    padding: 0;
    margin: 0;
    box-shadow: none;
    max-width: 100%;
  }
`;

const Page = ({ title, children, ...props }) => (
  <Wrapper>
    <Heading>{title}</Heading>
    <Content {...props}>{children}</Content>
  </Wrapper>
);

export default Page;
