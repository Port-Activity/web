import React from 'react';
import styled from 'styled-components';

import Search from '../ui/Search';

const StyledPageSearch = styled.div`
  float: left;
  input {
    min-width: 250px;
  }
`;

const PageSearch = props => {
  return (
    <StyledPageSearch>
      <Search autoComplete="off" {...props} />
    </StyledPageSearch>
  );
};

export default PageSearch;
