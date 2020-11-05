import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

import helpMD from '../help/HELP.md';

const HelpDiv = styled.div`
  h2 {
    margin-top: ${({ theme }) => theme.sizing.gap_medium};
  }
  h3 {
    margin-top: ${({ theme }) => theme.sizing.gap_medium};
  }
  h4 {
    margin-top: ${({ theme }) => theme.sizing.gap_medium};
  }
`;

const HelpPage = () => {
  const { namespace } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const [helpText, setHelpText] = useState('');

  useEffect(() => {
    document.title = 'Help | Port Activity App';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(helpMD);
      const text = await result.text();

      setHelpText(text);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Page title={t('Help')}>
        <HelpDiv>
          <ReactMarkdown source={helpText} />
        </HelpDiv>
      </Page>
    </Layout>
  );
};

export default HelpPage;
