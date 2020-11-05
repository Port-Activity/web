import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  display: block;
  font-size: 0.8571rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const Label = props => <StyledLabel {...props} />;

export default Label;
