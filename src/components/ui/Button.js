import React from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';

const StyledButton = styled.button`
  display: inline-block;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.secondary};
  border: 0.125rem solid transparent;
  border-radius: ${({ theme }) => theme.style.border_radius};
  padding: ${({ theme }) => theme.sizing.gap_small};
  min-width: 150px;
  box-shadow: ${({ theme }) => theme.fx.box_shadow};
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.sizing.gap};
  transition: ${({ theme }) => theme.transition.ease(0.2)};
  white-space: nowrap;
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.color.secondary)};
  }
  &:active {
    box-shadow: none;
  }
  &:last-child {
    margin-bottom: 0;
  }
  ${props => {
    if (props.primary) {
      return `
        background: ${props.theme.color.primary};
      `;
    } else if (props.outline) {
      return `
        box-shadow: none;
        background: none;
        border: 0.125rem solid ${props.theme.color.secondary};
        &:hover {
          color: currentColor;
          border-color: currentColor;
          background: none;
        }
      `;
    } else if (props.link && props.disabled) {
      return `
        cursor: not-allowed;
        color: ${props.theme.color.grey};
        min-width: 0;
        background: none;
        box-shadow: none;
        border: none;
        padding-left: 0;
        padding-right: 0;
        outline: none;
        &:hover {
          color: ${props.theme.color.grey};
          background: none;
          text-decoration: none;
        }
      `;
    } else if (props.link) {
      return `
        color: ${props.warning ? props.theme.color.warning : props.theme.color.secondary};
        min-width: 0;
        background: none;
        box-shadow: none;
        border: none;
        padding-left: 0;
        padding-right: 0;
        outline: none;
        &:hover {
          color: ${props.warning ? lighten(0.1, props.theme.color.warning) : lighten(0.1, props.theme.color.secondary)};
          background: none;
          text-decoration: none;
        }
      `;
    } else if (props.disabled) {
      return `
        cursor: not-allowed;
        color: ${props.theme.color.grey_light};
        background: ${props.theme.color.grey};
        outline: none;
        &:hover {
          background: ${props.theme.color.grey};
        }
      `;
    }
  }}
  i {
    fill: currentColor;
    width: 20px;
    height: 20px;
    margin-right: ${({ theme }) => theme.sizing.gap_small};
    top: -2px;
  }
`;

const Button = props => <StyledButton {...props} />;

export default Button;
