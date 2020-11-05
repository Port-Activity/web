import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 87.5%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ${({ theme }) => theme.text.font_text};
    line-height: ${({ theme }) => theme.text.line_height};
    color: ${({ theme }) => theme.color.grey_dark};
    background: ${({ theme }) => theme.color.white};
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  a {
    color: ${({ theme }) => theme.color.secondary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  .ant-pagination { }
  .ant-calendar { }
  .ant-timeline {
    &-item {
      position: relative;
      i {
        height: 2rem;
        width: 2rem;
        svg {
          margin-top: 4px;
        }
      }
      &-head { }
      &-left { }
      &-right {
        i {
          transform: scaleX(-1);
        }
      }
      &-content {
        display: flow-root;
        max-width: calc(50% - 32px);
        .ant-timeline-item-left & {
          left: calc(50% + 16px) !important;
        }
      }
    }
  }
  .ant-popover {
    padding-left: ${({ theme }) => theme.sizing.gap_medium};
    padding-right: ${({ theme }) => theme.sizing.gap_medium};
    &-message {
      margin: 0;
      padding: 0;
      &-title {
        color: ${({ theme }) => theme.color.grey_dark};
        font-weight: 700;
        padding: 0 !important;
        margin: 0 0 ${({ theme }) => theme.sizing.gap_small};
      }
    }
    &-buttons {
      margin: 0;
      .ant-btn {
        padding: 0;
        border: none;
        background: none;
        box-shadow: none;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.color.secondary};
        margin-right: ${({ theme }) => theme.sizing.gap_small};
        &:hover {
          background: none;
        }
        & + .ant-btn {
          margin-right: 0;
          color: ${({ theme }) => theme.color.warning};
        }
      }
    }
  }
  .ant-collapse {
    &-item {
      transition: all .25s ease-in-out;
      background: ${({ theme }) => theme.color.white};
      &.ant-collapse-item-active {
        color: ${({ theme }) => theme.color.black};
        background: ${({ theme }) => theme.color.grey_lighter};
        p {
          color: inherit;
        }
      }
    }
    &-content {
      padding-left: 1.725rem;
    }
  }
  .ant-tabs {
    &-tab {
      font-weight: 700;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      &-active {
        font-weight: 700 !important;
      }
    }
  }
  .ant-alert {
    &-banner {
      padding: ${({ theme }) => theme.sizing.gap} ${({ theme }) => theme.sizing.gap_big} !important;
      border-bottom: 1px solid ${({ theme }) => theme.color.grey_light} !important;
    }
    &-close-icon {
      top: 13px !important;
    }
  }
  .ant-message {
    top: 12px !important;
    &-notice-content {
      color: ${({ theme }) => theme.color.black};
      font-size: 0.8571rem;
      font-weight: 700;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      box-shadow: ${({ theme }) => theme.fx.box_shadow};
    }
  }
`;

export default GlobalStyle;
