import React from 'react';
import styled from 'styled-components';

const StyledList = styled.ul`
  margin: 0 0 ${({ theme }) => theme.sizing.gap_medium};
  padding: 0 0 0 ${({ theme }) => theme.sizing.gap_medium};
`;

const List = ({ ordered, items, ...props }) => {
  if (ordered) {
    return (
      <StyledList {...props}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </StyledList>
    );
  }
  return (
    <StyledList as="ol" {...props}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </StyledList>
  );
};

export default List;
