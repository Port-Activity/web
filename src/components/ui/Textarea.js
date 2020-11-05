import React from 'react';
import styled from 'styled-components';

import Label from './Label';

const TextareaWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const StyledTextarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.color.grey_light};
  border-radius: ${({ theme }) => theme.style.border_radius};
  padding: ${({ theme }) => theme.sizing.gap_small};
  color: ${({ theme }) => theme.color.grey_dark};
  background: ${({ theme }) => theme.color.white};
  min-width: 240px;
  min-height: 96px;
  max-width: 100%;
`;

const Textarea = ({ label, ...props }) => (
  <TextareaWrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    <StyledTextarea {...props} />
  </TextareaWrapper>
);

export default Textarea;
