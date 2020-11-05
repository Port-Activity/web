import React from 'react';
import styled from 'styled-components';

import { TimestampProvider } from '../../context/TimestampContext';

import Cards from './Cards';
import Timestamps from './Timestamps';

const StyledTimeline = styled.div`
  display: grid;
  grid-template-rows: 220px auto;
  height: ${props => (props.isIE || props.isEdge ? 'auto' : 'calc(100vh - 64px)')};
  overflow-x: scroll;
  overflow-y: hidden;
  background: ${({ theme }) => theme.color.grey_lighter};
  display: -ms-grid;
  -ms-grid-rows: 220px auto;
`;

const Timeline = props => {
  return (
    <TimestampProvider>
      <StyledTimeline {...props}>
        <Cards />
        <Timestamps />
      </StyledTimeline>
    </TimestampProvider>
  );
};

export default Timeline;
