import React from 'react';
import styled from 'styled-components';

import Icon from '../ui/Icon';

const StyledShipRoute = styled.div`
  font-weight: 700;
  i {
    position: relative;
    top: -2px;
    height: 10px;
    width: 10px;
    margin: 0 ${({ theme }) => theme.sizing.gap};
  }
`;

const ShipRoute = ({ from, to, next }) => {
  if (!from && !to) {
    return null;
  }
  return (
    <StyledShipRoute>
      {from} <Icon type="arrow-right" /> {to} <Icon type="arrow-right" /> {next}
    </StyledShipRoute>
  );
};

export default ShipRoute;
