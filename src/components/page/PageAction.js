import React from 'react';
import styled from 'styled-components';

const StyledPageAction = styled.div`
  display: flow-root;
  position: relative;
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
  @media print {
    display: none;
  }
  & > button {
    float: right;
    margin-bottom: 0;
  }
`;

const PageAction = ({ children, ...props }) => {
  return <StyledPageAction {...props}>{children}</StyledPageAction>;
};

export default PageAction;
