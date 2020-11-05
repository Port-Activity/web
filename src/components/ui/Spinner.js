import React from 'react';
import styled from 'styled-components';

import { Spin } from 'antd';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinner = props => (
  <Wrapper>
    <Spin {...props} />
  </Wrapper>
);

export default Spinner;
