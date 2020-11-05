import React from 'react';
import styled from 'styled-components';

const StyledFieldset = styled.fieldset``;

const Fieldset = ({ children }) => {
  return <StyledFieldset>{children}</StyledFieldset>;
};

export default Fieldset;
