import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';

import { UserContext } from '../context/UserContext';

import { defaultPortList } from '../utils/constants';

import { Alert } from 'antd';

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

const ResetPassword = ({ location }) => {
  const { resetPassword } = useContext(UserContext);
  const history = useHistory();
  const { port, token } = queryString.parse(location.search);

  const portEntry = defaultPortList.find(entry => entry.key === port);
  let portName = '';
  if (portEntry) {
    portName = portEntry.label;
  }

  const { t } = useTranslation(port);

  const initState = {
    confirm: '',
    password: '',
    resetRequested: false,
  };

  const [state, setState] = useState(initState);
  const { password, confirm, resetRequested } = state;

  const dontMatch = state.password.length > 0 && state.password !== state.confirm ? true : false;
  const tooShort = state.password.length < 1;

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (password && confirm && token) {
      if (password !== confirm) {
        // TODO: show errors
        console.error(t('Passwords do not match'));
        return;
      }
      // TODO: validation
      const res = await resetPassword(password, token);
      if (res) {
        setState({
          ...state,
          resetRequested: true,
        });
      }
    }
  };

  return resetRequested ? (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm>
        <LoginReturnLink onClick={() => history.replace('/')}>{t('« Return to login')}</LoginReturnLink>
        <PortName h4>{t('Port of {{portname}}', { portname: portName })}</PortName>
        <Heading h3>{t('Reset Password')}</Heading>
        <Alert
          type="success"
          message={t('Your password is now reset')}
          description={t('Please login with your new credentials.')}
        />
      </LoginForm>
    </LoginWrapper>
  ) : (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm onSubmit={handleSubmit}>
        <LoginReturnLink onClick={() => history.replace('/')}>{t('« Return to login')}</LoginReturnLink>
        <PortName h4>{t('Port of {{portname}}', { portname: portName })}</PortName>
        <Heading h3>{t('Reset Password')}</Heading>
        {dontMatch && <Alert type="error" message={t('Passwords do not match')} />}
        {tooShort && <Alert type="error" message={t('Password cannot be empty!')} />}
        <Paragraph>{t('Please enter your new password')}</Paragraph>
        <Input
          label={t('Password')}
          name={t('Password')}
          type="password"
          onChange={e => setState({ ...state, password: e.target.value })}
          autoFocus
        />
        <Input
          label={t('Confirm password')}
          name={t('Confirm')}
          type="password"
          onChange={e => setState({ ...state, confirm: e.target.value })}
        />
        <Button disabled={tooShort || dontMatch}>{t('Reset Password')}</Button>
      </LoginForm>
    </LoginWrapper>
  );
};

export default ResetPassword;
