import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const StyledCardInfo = styled.div`
  position: absolute;
  z-index: 5;
  left: -1px;
  right: -1px;
  animation: ${props => (props.show ? fadeIn : fadeOut)} 0.125s;
  padding: ${({ theme }) => theme.sizing.gap} ${({ theme }) => theme.sizing.gap} 0;
  background: ${props => (props.pinned ? props.theme.color.white : props.theme.color.grey_lighter)};
  border-left: 1px solid ${({ theme }) => theme.color.grey_light};
  border-right: 1px solid ${({ theme }) => theme.color.grey_light};
  border-bottom: 1px solid ${({ theme }) => theme.color.grey_light};
  border-radius: ${({ theme }) => theme.style.border_radius};
`;

const CardInfo = ({ show, children }) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
      <StyledCardInfo show={show} onAnimationEnd={onAnimationEnd}>
        {children}
      </StyledCardInfo>
    )
  );
};

export default CardInfo;
