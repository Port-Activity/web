import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a`
  display: block;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const LoginReturnLink = props => <StyledLink {...props} />;

export default LoginReturnLink;
