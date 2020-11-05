import React from 'react';
import styled from 'styled-components';

import Label from './Label';

const InputWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const StyledInput = styled.input`
  border: 1px solid ${({ theme }) => theme.color.grey_light};
  border-radius: ${({ theme }) => theme.style.border_radius};
  padding: ${({ theme }) => theme.sizing.gap_small};
  color: ${({ theme }) => theme.color.grey_dark};
  background: ${({ theme }) => theme.color.white};
  min-width: 180px;
  min-height: 2.8rem;
  max-width: 100%;
`;

const Info = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.text.small};
  color: ${({ theme }) => theme.color.grey_light};
  margin-top: ${({ theme }) => theme.sizing.gap_tiny};
  margin-left: ${({ theme }) => theme.sizing.gap_small};
`;

const Input = ({ label, info, ...props }) => (
  <InputWrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    <StyledInput {...props} />
    {info && <Info>{info}</Info>}
  </InputWrapper>
);

export default Input;
