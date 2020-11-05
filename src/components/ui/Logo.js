import React from 'react';

import { ReactComponent as LogoImage } from '../../images/logo.svg';
import { ReactComponent as LogoImageRauma } from '../../images/logo-rauma.svg';
import { ReactComponent as LogoImageGavle } from '../../images/logo-gavle.svg';

const Logo = ({ port }) => {
  switch (port) {
    case 'rauma':
      return <LogoImageRauma alt="Port Activity App" />;
    case 'gavle':
      return <LogoImageGavle alt="Port Activity App" />;
    default:
      return <LogoImage alt="Port Activity App" />;
  }
};

export default Logo;
