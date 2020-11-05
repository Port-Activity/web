import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import Icon from './ui/Icon';
import Button from './ui/Button';

const StyledProfile = styled.div`
  margin-left: auto;
  @media (min-width: 768px) {
    min-width: 120px;
    margin-right: ${({ theme }) => theme.sizing.gap_tiny};
  }
`;

const LoggedIn = styled.div``;

const Username = styled.a`
  font-weight: 700;
  color: ${({ theme }) => theme.color.white};
  margin-left: ${({ theme }) => theme.sizing.gap_tiny};
  @media (max-width: 768px) {
    float: right;
  }
`;

const LogoutLink = styled(Button)`
  float: right;
  text-transform: none;
  padding-top: ${({ theme }) => theme.sizing.gap_tiny};
  padding-bottom: 0;
  i {
    top: 0;
    margin-right: 0;
    svg {
      fill: currentColor;
    }
  }
`;

const LoggedInLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Profile = ({ username }) => {
  const { namespace, logout } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const history = useHistory();

  const handleLogout = () => {
    history.entries = [];
    history.index = -1;
    history.push('/');
    logout();
  };

  return (
    <StyledProfile>
      <LoggedIn>
        <LoggedInLabel>{t('Signed in as')}</LoggedInLabel>
        <Username onClick={() => history.push('/profile')}>{username}</Username>
      </LoggedIn>
      <LogoutLink link onClick={handleLogout}>
        {t('Sign out')} <Icon type="logout" />
      </LogoutLink>
    </StyledProfile>
  );
};

export default Profile;
