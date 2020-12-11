import React from 'react';
import styled from 'styled-components';

import Label from './Label';
import SelectArrow from '../../images/icons/select-arrow.svg';
import { Select } from 'antd';

const { Option } = Select;

const SelectWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap};
  table & {
    margin-bottom: 0;
  }
`;

const StyledSelect = styled(Select)`
  color: ${({ theme }) => theme.color.grey_dark};
  appearance: none;
  background: ${({ theme }) => theme.color.white} url(${SelectArrow}) no-repeat 96% 50%;
  min-width: 194px;
  max-width: 100%;
`;

const SelectWithSearch = ({ label, options, ...props }) => (
  <SelectWrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    <StyledSelect
      {...props}
      showSearch
      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      {options.map(option => (
        <Option key={option.key} value={option.value} label={option.label} title={option.title}>
          {option.label}
        </Option>
      ))}
    </StyledSelect>
  </SelectWrapper>
);

export default SelectWithSearch;
