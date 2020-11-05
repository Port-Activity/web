import React from 'react';
import styled, { css } from 'styled-components';

const elementStyle = css`
  font-family: ${({ theme }) => theme.text.font_title};
  color: inherit;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
`;

const HeadingOne = styled.h1`
  ${elementStyle}
  font-size: 2.429rem;
  line-height: 1;
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.sizing.gap_big};
`;

const HeadingTwo = styled.h2`
  ${elementStyle}
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
`;

const HeadingThree = styled.h3`
  ${elementStyle}
  font-size: 1.571rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.015em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const HeadingFour = styled.h4`
  ${elementStyle}
  font-size: 1.286rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Heading = ({ h2, h3, h4, ...props }) => {
  if (h2) return <HeadingTwo {...props} />;
  if (h3) return <HeadingThree {...props} />;
  if (h4) return <HeadingFour {...props} />;
  return <HeadingOne {...props} />;
};

export default Heading;
