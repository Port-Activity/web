import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import Heading from '../components/ui/Heading';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Paragraph from '../components/ui/Paragraph';

import LoginWrapper from '../components/login/LoginWrapper';
import LoginLogo from '../components/login/LoginLogo';
import LoginForm from '../components/login/LoginForm';
import LoginReturnLink from '../components/login/LoginReturnLink';

const PortName = styled(Heading)`
  color: ${({ theme }) => theme.color.secondary};
`;

const ForgotPassword = ({ portName }) => {
  const { setCurrentAuthView, requestPasswordReset, namespace, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const [email, setEmail] = useState('');

  const disabled = email === '' ? true : false;

  const handleForgotPassword = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (email) {
      const res = await requestPasswordReset(email, namespace);
      if (res) {
        setAlert({ type: 'info', message: 'Password is sent.' });
        setCurrentAuthView('LOGIN');
      }
    }
  };

  return (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm onSubmit={handleForgotPassword}>
        <LoginReturnLink onClick={() => setCurrentAuthView('LOGIN')}>{t('« Return to login')}</LoginReturnLink>
        <PortName h4>{t('Port of {{portname}}', { portname: portName })}</PortName>
        <Heading h3>{t('Forgot your password?')}</Heading>
        <Paragraph>{t('Please enter your e-mail address.')}</Paragraph>
        <Input label={t('Email')} name={t('Email')} type="email" onChange={e => setEmail(e.target.value)} autoFocus />
        <Button disabled={disabled}>{t('Request Password Reset')}</Button>
      </LoginForm>
    </LoginWrapper>
  );
};

export default ForgotPassword;
