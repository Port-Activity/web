import React, { useContext, useEffect } from 'react';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const UserInfo = styled.dl`
  display: flex;
  flex-wrap: wrap;
  font-size: ${({ theme }) => theme.text.small};
  max-width: 80%;
`;

const Term = styled.dt`
  font-weight: 700;
  text-transform: uppercase;
  width: 30%;
`;

const Description = styled.dd`
  color: ${({ theme }) => theme.color.grey};
  margin-left: auto;
  width: 70%;
`;

const Permission = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.sizing.gap_tiny};
`;

const ProfilePage = () => {
  const { namespace, user } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const username = `${user.first_name} ${user.last_name}`;

  useEffect(() => {
    document.title = 'User profile | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page title={`User profile: ${username}`}>
        <UserInfo>
          {Object.keys(user).map(key => {
            if (user[key]) {
              return (
                <>
                  <Term>{t(key.replace(/_/g, ' '))}</Term>
                  <Description>
                    {key === 'permissions'
                      ? user[key].map((row, index) => <Permission key={index}>{row}</Permission>)
                      : user[key]}
                  </Description>
                </>
              );
            } else {
              return null;
            }
          })}
        </UserInfo>
      </Page>
    </Layout>
  );
};

export default ProfilePage;
