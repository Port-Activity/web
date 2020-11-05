import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledTimestampGroup = styled.div`
  color: ${props => (props.at === 'port' ? props.theme.color.grey_dark : props.theme.color.white)};
  background: ${props => (props.at === 'port' ? props.theme.color.white : props.theme.color.secondary)};
  border-radius: ${({ theme }) => theme.style.border_radius};
  margin: ${({ theme }) => theme.sizing.gap_small} 0;
  padding: ${({ theme }) => theme.sizing.gap} 0 ${({ theme }) => theme.sizing.gap}
    ${({ theme }) => theme.sizing.gap_big};
  position: relative;
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  animation: ${fadeIn} 0.125s;
  &:before {
    content: '';
    position: absolute;
    left: 16px;
    top: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.primary};
    width: 1px;
    height: 100%;
  }
  &:last-of-type {
    margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
  }
  &:first-of-type {
    margin-top: ${({ theme }) => theme.sizing.gap_tiny};
  }
`;

const TimestampGroup = props => {
  return <StyledTimestampGroup {...props} />;
};

export default TimestampGroup;
