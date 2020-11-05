import React from 'react';
import styled from 'styled-components';

import Form from '../ui/Form';

const StyledForm = styled(Form)`
  position: relative;
  width: 75vw;
  max-width: 40rem;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.primary};
  padding: ${({ theme }) => theme.sizing.gap};
  border-radius: ${({ theme }) => theme.style.border_radius_big};
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
  input,
  button,
  select {
    width: 100%;
  }
`;

const LoginForm = props => <StyledForm {...props} />;

export default LoginForm;
