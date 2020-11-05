import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';

import { Alert } from 'antd';

import Heading from '../components/ui/Heading';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

import LoginWrapper from '../components/login/LoginWrapper';
import LoginLogo from '../components/login/LoginLogo';
import LoginForm from '../components/login/LoginForm';

const PortName = styled(Heading)`
  color: ${({ theme }) => theme.color.secondary};
`;

const AmnesiaLink = styled.a`
  float: right;
  margin-top: -${({ theme }) => theme.sizing.gap_small};
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const LoginAlert = styled(Alert)`
  && {
    margin-bottom: ${({ theme }) => theme.sizing.gap};
  }
`;

const Login = ({ portName }) => {
  const { login, setCurrentAuthView, namespace, alert } = useContext(UserContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const initState = {
    username: '',
    password: '',
  };

  const [credentials, setCredentials] = useState(initState);
  const { username, password } = credentials;
  const disabled = username === '' || password === '' ? true : false;

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (username && password) {
      login(username, password);
    }
  };

  return (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm onSubmit={handleSubmit}>
        <PortName h4>{t('Port of {{portname}}', { portname: portName })}</PortName>
        <Heading h3>{t('Login')}</Heading>
        {alert && <LoginAlert type={alert.type} message={alert.message} description={alert.description} />}
        <Input
          label={t('Username / Email')}
          name={t('Email')}
          type="text"
          onChange={e => setCredentials({ ...credentials, username: e.target.value })}
          autoFocus
        />
        <Input
          label={t('Password')}
          name={t('Password')}
          type="password"
          onChange={e => setCredentials({ ...credentials, password: e.target.value })}
        />
        <AmnesiaLink onClick={() => setCurrentAuthView('FORGOT_PASSWORD')}>
          {t('Did you forget your password?')}
        </AmnesiaLink>
        <Button disabled={disabled}>{t('Login')}</Button>
        <Button outline onClick={() => setCurrentAuthView('REGISTER')}>
          {t('Register as a New User')}
        </Button>
      </LoginForm>
    </LoginWrapper>
  );
};

export default Login;
