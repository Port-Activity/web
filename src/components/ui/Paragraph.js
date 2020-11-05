import React from 'react';
import styled from 'styled-components';

const StyledParagraph = styled.p`
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Paragraph = props => <StyledParagraph {...props} />;

export default Paragraph;
