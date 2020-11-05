import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { formatTime } from '../utils/utils';

const StyledClock = styled.div``;

const Clock = ({ timeOnly, ...props }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 6000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return <StyledClock {...props}>{formatTime(date, timeOnly)}</StyledClock>;
};

export default Clock;
