import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import versionData from '../version';

import { ReactComponent as LogoCentralBalticImage } from '../images/logo-centralbaltic.svg';

const StyledBuildVersion = styled.p`
  color: ${({ theme }) => theme.color.grey};
  margin: 0;
  white-space: nowrap;
`;

const LogoWrapper = styled.a`
  display: block;
  margin-bottom: ${({ theme }) => theme.sizing.gap_small};
  opacity: 0.5;
  transition: ${({ theme }) => theme.transition.cubic(0.4)};
  max-width: 12rem;
  &:hover {
    opacity: 0.7;
  }
`;

const VersionNumber = styled.span``;
const VersionBuild = styled.span``;
const VersionTimestamp = styled.span`
  display: block;
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const PrivacyPolicyLink = styled(Link)`
  color: ${({ theme }) => theme.color.grey};
`;

const BuildVersion = props => {
  const { version, build, ts } = versionData;
  return (
    <StyledBuildVersion {...props}>
      <LogoWrapper href="https://centralbaltic.eu">
        <LogoCentralBalticImage alt="Central Baltic" />
      </LogoWrapper>
      <VersionNumber>{version}</VersionNumber>, <VersionBuild>Build {build}</VersionBuild>
      <VersionTimestamp>{ts}</VersionTimestamp>
      <PrivacyPolicyLink to="/privacy-policy">Privacy policy</PrivacyPolicyLink>
    </StyledBuildVersion>
  );
};

export default BuildVersion;
