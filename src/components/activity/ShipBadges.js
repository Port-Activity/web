import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import { Tag } from 'antd';

const ShipTags = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const ShipTag = styled(Tag)`
  && {
    border: none;
    font-size: 0.8571rem;
    font-weight: 700;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    padding: 0 ${({ theme }) => theme.sizing.gap_small};
    color: ${({ theme }) => theme.color.white};
    background: ${({ theme }) => theme.color.secondary};
    ${props => {
      if (props.value === 'arriving') {
        return `
          color: ${props.theme.color.grey_dark};
          background: ${props.theme.color.white};
          border: 1px solid ${props.theme.color.grey_light};
          &:hover {
            border-color: ${darken(0.1, props.theme.color.grey_light)};
          }
        `;
      } else if (props.value === 'at berth') {
        return `
          background: ${props.theme.color.success};
          &:hover {
            background: ${darken(0.05, props.theme.color.success)};
          }
        `;
      } else if (props.value === 'departing') {
        return `
          color: ${props.theme.color.grey_dark};
          background: ${props.theme.color.highlight};
          border: 1px solid ${props.theme.color.grey_light};
          &:hover {
            background: ${darken(0.05, props.theme.color.highlight)};
          }
        `;
      }
    }};
  }
`;

const ShipBadges = ({ badges }) => {
  return (
    badges && (
      <ShipTags>
        {badges.map((tag, key) => (
          <ShipTag key={key} type={tag.type} value={tag.value}>
            {tag.value}
          </ShipTag>
        ))}
      </ShipTags>
    )
  );
};

export default ShipBadges;
