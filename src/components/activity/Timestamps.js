import React, { useRef, useEffect, useContext, useState } from 'react';
import styled from 'styled-components';

import { TimestampContext } from '../../context/TimestampContext';

import TimestampRow from './TimestampRow';

const StyledTimestamps = styled.div`
  display: grid;
  grid-template-rows: auto 2px auto;
  grid-column: 1;
  grid-row: 2;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: 100%;
  background: ${({ theme }) => theme.fx.gradient_blue};
  display: -ms-grid;
  -ms-grid-rows: auto 2px auto;
  -ms-grid-column: 1;
  -ms-grid-row: 2;
`;

const Divider = styled.div`
  position: relative;
  grid-column: 1;
  grid-row: 2;
  color: ${({ theme }) => theme.color.white};
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 64px, ${({ theme }) => theme.color.neon} 5%);
  -ms-grid-column: 1;
  -ms-grid-row: 2;
`;

const Timestamps = props => {
  const { pastTimestamps, futureTimestamps, totalVessels } = useContext(TimestampContext);
  const [onceLoaded, setOnceLoaded] = useState(false);
  const dividerRef = useRef();

  useEffect(() => {
    if (totalVessels) {
      if (!onceLoaded) {
        dividerRef.current.scrollIntoView({
          block: 'center',
          inline: 'start',
        });
        setOnceLoaded(true);
      }
    }
  }, [pastTimestamps, futureTimestamps, totalVessels, onceLoaded, setOnceLoaded]);

  return (
    <StyledTimestamps {...props}>
      <TimestampRow past timestamps={pastTimestamps} totalVessels={totalVessels} />
      <Divider ref={dividerRef} />
      <TimestampRow future timestamps={futureTimestamps} totalVessels={totalVessels} />
    </StyledTimestamps>
  );
};

export default Timestamps;
