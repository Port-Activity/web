import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';
import { TimestampContext } from '../../context/TimestampContext';

import Search from '../ui/Search';

import Card from './Card';

const StyledCards = styled.div`
  display: grid;
  grid-column: 1;
  grid-row: 1;
  grid-template-columns: 250px repeat(${({ totalVessels }) => totalVessels}, 300px);
  grid-column-gap: 24px;
  grid-auto-flow: row;
  position: relative;
  padding: ${({ theme }) => theme.sizing.gap} ${({ theme }) => theme.sizing.gap_big};
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -16px;
    height: 16px;
    z-index: 5;
    width: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, transparent 100%);
    background-blend-mode: darken;
  }
  display: -ms-grid;
  -ms-grid-column: 1;
  -ms-grid-row: 1;
  -ms-grid-columns: 250px 300px[${({ totalVessels }) => totalVessels}]);
`;

const SearchWrapper = styled.div`
  grid-column: 1;
  grid-row: 1;
  min-width: 250px;
  margin-right: 24px;
  input {
    width: 100%;
  }
  -ms-grid-column: 1;
  -ms-grid-row: 1;
`;

const Cards = props => {
  const { namespace } = useContext(UserContext);
  const { timestamps, totalVessels, setSearch } = useContext(TimestampContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);
  return (
    <StyledCards totalVessels={totalVessels} {...props}>
      <SearchWrapper>
        <Search
          name="search"
          placeholder={t('Search vessel by name')}
          autoComplete="off"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchWrapper>
      {timestamps.map(({ ship }) => (
        <Card totalVessels={totalVessels} key={ship.id} data={ship} />
      ))}
    </StyledCards>
  );
};

export default Cards;
