import React from 'react';
import styled, { css } from 'styled-components';

import TimestampGroup from './TimestampGroup';
import Timestamp from './Timestamp';

function createCSS({ totalVessels }) {
  let styles = '';
  for (let i = 1; i <= totalVessels; i++) {
    styles += `
          &:nth-child(${i}) {
            grid-column: ${i};
            grid-row: 1;
            -ms-grid-column: ${i};
            -ms-grid-row: 1;
          }
       `;
  }
  return css`
    ${styles}
  `;
}

const StyledTimestampRow = styled.div`
  display: grid;
  align-items: ${({ future }) => (future ? 'start' : 'end')};
  grid-template-columns: repeat(${({ totalVessels }) => totalVessels}, 288px);
  grid-column-gap: 36px;
  grid-row: ${({ past }) => (past ? 1 : 3)};
  padding-left: 306px;
  display: -ms-grid;
  -ms-grid-columns: 288px[ ${({ totalVessels }) => totalVessels}];
  -ms-grid-row: ${({ past }) => (past ? 1 : 3)};
`;

const Column = styled.div`
  width: 292px;
  margin-right: 29px;
  ${createCSS}
`;

const TimestampRow = ({ timestamps, totalVessels, ...props }) => {
  return (
    <StyledTimestampRow totalVessels={totalVessels} {...props}>
      {timestamps.map(column => (
        <Column totalVessels={totalVessels} key={column.id}>
          {column.events
            .filter(event => event.timestamps.length > 0)
            .map(event => (
              <TimestampGroup at={event.location} key={event.id}>
                {event.timestamps.map((timestamp, index) => (
                  <Timestamp past={props.past} future={props.future} data={timestamp} key={index} />
                ))}
              </TimestampGroup>
            ))}
        </Column>
      ))}
    </StyledTimestampRow>
  );
};

export default TimestampRow;
