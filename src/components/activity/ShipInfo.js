import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../../context/UserContext';

const StyledShipInfo = styled.dl`
  display: flex;
  flex-wrap: wrap;
  font-size: ${({ theme }) => theme.text.small};
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Term = styled.dt`
  width: 40%;
  font-weight: 700;
  text-transform: uppercase;
`;

const Description = styled.dd`
  width: 60%;
  margin-left: auto;
  color: ${({ theme }) => theme.color.grey};
`;

const ShipInfo = ({ hasData, ...props }) => {
  const { namespace } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  return (
    hasData && (
      <StyledShipInfo>
        {Object.keys(props).map(key => {
          if (props[key] && props[key] !== 'hasData') {
            return (
              <>
                <Term>{t(key.replace(/_/g, ' '))}</Term>
                <Description>
                  {props[key]} {['loa', 'beam', 'draft'].includes(key) ? t('meters') : ''}
                </Description>
              </>
            );
          } else {
            return null;
          }
        })}
      </StyledShipInfo>
    )
  );
};

export default ShipInfo;
