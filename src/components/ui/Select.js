import React from 'react';
import styled from 'styled-components';

import Label from './Label';
import SelectArrow from '../../images/icons/select-arrow.svg';

const SelectWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap};
  table & {
    margin-bottom: 0;
  }
`;

const StyledSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.color.grey_light};
  border-radius: ${({ theme }) => theme.style.border_radius};
  padding: ${({ theme }) => theme.sizing.gap_small};
  color: ${({ theme }) => theme.color.grey_dark};
  appearance: none;
  background: ${({ theme }) => theme.color.white} url(${SelectArrow}) no-repeat 96% 50%;
  min-width: 180px;
  max-width: 100%;
`;

const Select = ({ label, options, ...props }) => (
  <SelectWrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    <StyledSelect {...props}>
      {options.map(option => (
        <option key={option.key} value={option.value} label={option.label} title={option.title}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  </SelectWrapper>
);

export default Select;
