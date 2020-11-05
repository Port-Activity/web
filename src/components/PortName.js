import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import Clock from './Clock';
import Logo from './ui/Logo';
import Heading from './ui/Heading';
import { defaultPortList } from '../utils/constants';

const LogoHeader = styled.div`
  display: flex;
  svg {
    width: 48px;
    height: 48px;
    margin-right: ${({ theme }) => theme.sizing.gap};
  }
  h4,
  p {
    white-space: nowrap;
    margin-bottom: 0;
  }
`;

const NameWrapper = styled.div``;

const PortName = props => {
  const { namespace } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);
  const port = defaultPortList.find(port => port.key === namespace);

  return (
    <LogoHeader {...props}>
      <Logo port={namespace} />
      <NameWrapper>
        <Heading h4>
          <Link to="/">{t('Port of {{portname}}', { portname: port.label })}</Link>
        </Heading>
        <Clock />
      </NameWrapper>
    </LogoHeader>
  );
};

export default PortName;
