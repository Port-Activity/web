import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

import { DatePicker as antdDatepicker } from 'antd';
import { TIME_FORMAT } from '../../utils/constants';

const StyledDatepicker = styled(antdDatepicker)`
  && {
    width: 100%;
    .ant-picker-suffix {
      width: auto;
      margin-left: auto;
      i {
        width: 1.5rem;
        height: 1.5rem;
        svg {
          fill: ${({ theme }) => theme.color.grey_light};
        }
      }
    }
  }
`;

const Datepicker = props => (
  <StyledDatepicker
    clearIcon={null}
    size="large"
    showTime={{ format: 'HH:mm', minuteStep: 15 }}
    format={TIME_FORMAT}
    suffixIcon={<Icon type="calendar-clock" />}
    {...props}
  />
);

export default Datepicker;
