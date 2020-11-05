import React from 'react';
import styled from 'styled-components';

import { Table as antdTable } from 'antd';

const StyledTable = styled(antdTable)`
  && {
    width: 100%;
    margin: 0 0 ${({ theme }) => theme.sizing.gap};
    th,
    td {
      padding: ${({ theme }) => theme.sizing.gap};
      background: ${({ theme }) => theme.color.white};
      border-bottom: 1px solid ${({ theme }) => theme.color.grey_light};
      @media print {
        border-bottom: 1pt solid black;
      }
    }
    th {
      font-size: ${({ theme }) => theme.text.small};
      font-weight: 700;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      white-space: nowrap;
      padding: ${({ theme }) => theme.sizing.gap_small} ${({ theme }) => theme.sizing.gap};
    }
    table,
    .ant-table {
      background: none;
      tr,
      th,
      td {
        background: none;
      }
    }
    .ant-table-wrapper + .ant-table-wrapper {
      margin-top: ${({ theme }) => theme.sizing.gap_medium};
    }
  }
`;

const Table = props => <StyledTable {...props} />;

export default Table;
