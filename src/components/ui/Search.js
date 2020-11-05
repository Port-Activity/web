import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import Label from './Label';
import Input from './Input';

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const StyledSearch = styled(Input)`
  padding-left: ${({ theme }) => theme.sizing.gap_huge};
`;

const StyledSubmit = styled.button`
  position: absolute;
  left: ${({ theme }) => theme.sizing.gap_small};
  top: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  i {
    width: 24px;
    height: 24px;
    svg {
      fill: ${({ theme }) => theme.color.grey};
    }
  }
`;

const Search = ({ label, ...props }) => (
  <SearchWrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    <StyledSearch type="search" autoComplete="off" {...props} />
    <StyledSubmit>
      <Icon type="search" />
    </StyledSubmit>
  </SearchWrapper>
);

export default Search;
