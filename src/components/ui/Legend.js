import React from 'react';
import styled from 'styled-components';

const StyledLegend = styled.legend`
  font-size: 1.286rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Legend = ({ title }) => {
  return <StyledLegend>{title}</StyledLegend>;
};

export default Legend;
