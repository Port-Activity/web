import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import Icon from '../ui/Icon';
import Heading from '../ui/Heading';

const fadeIn = keyframes`
  0% {
    top: -100%;
    opacity: 0;
  }
  100% {
    top: -${({ theme }) => theme.sizing.gap_tiny};
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

const StyledPageActionForm = styled.div`
  overflow-y: auto;
  max-height: 70vh;
  position: absolute;
  z-index: 5;
  min-width: 320px;
  top: -${({ theme }) => theme.sizing.gap_tiny};
  right: -${({ theme }) => theme.sizing.gap_tiny};
  padding: ${({ theme }) => theme.sizing.gap};
  box-shadow: ${({ theme }) => theme.fx.box_shadow_soft};
  background: ${({ theme }) => theme.color.grey_lighter};
  border-radius: ${({ theme }) => theme.style.border_radius};
  animation: ${props => (props.show ? fadeIn : fadeOut)} 0.125s;
  select,
  textarea,
  input {
    width: 100%;
  }
  button {
    margin-right: ${({ theme }) => theme.sizing.gap};
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const PageActionHeader = styled(Heading)`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: right;
  i {
    width: 20px;
    height: 20px;
    margin-right: ${({ theme }) => theme.sizing.gap_small};
    fill: currentColor;
    top: -1px;
  }
`;

const PageActionForm = ({ title, icon, children, show, ...props }) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
      <StyledPageActionForm show={show} onAnimationEnd={onAnimationEnd} {...props}>
        <PageActionHeader h4>
          <Icon type={icon} />
          {title}
        </PageActionHeader>
        {children}
      </StyledPageActionForm>
    )
  );
};

export default PageActionForm;
