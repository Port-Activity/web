import React, { useContext, useState } from 'react';
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
import LoginReturnLink from '../components/login/LoginReturnLink';

const PortName = styled(Heading)`
  color: ${({ theme }) => theme.color.secondary};
`;

const LoginAlert = styled(Alert)`
  && {
    margin-bottom: ${({ theme }) => theme.sizing.gap};
  }
`;

const GdprSection = styled.div`
  margin-bottom: ${({ theme }) => theme.sizing.gap};
`;

const Register = ({ portName, withoutCode }) => {
  const { setCurrentAuthView, register, namespace, alert, setAlert } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const initState = {
    firstName: '',
    lastName: '',
    code: '',
    email: '',
    password: '',
    confirm: '',
  };

  const [info, setInfo] = useState(initState);

  const handleRegister = async e => {
    e.preventDefault();
    const { firstName, lastName, code, email, password, confirm } = info;
    if (firstName && lastName && (code || withoutCode) && email && password && confirm) {
      if (password !== confirm) {
        setAlert({
          type: 'error',
          message: t('Registration error'),
          description: t('Passwords do not match!'),
        });
        return;
      }
      if (password.length < 1) {
        setAlert({
          type: 'error',
          message: t('Registration error'),
          description: t('Password cannot be empty!'),
        });
        return;
      }
      const res = await register(firstName, lastName, code, email, password);
      if (res) {
        setAlert({
          type: 'info',
          message: t('Registration complete'),
          description: t('User account was successfully created.'),
        });
      }
    }
  };

  const disabled =
    info.firstName === '' ||
    info.lastName === '' ||
    (info.code === '' && !withoutCode) ||
    info.email === '' ||
    info.password === '' ||
    info.confirm === ''
      ? true
      : false;

  return (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm onSubmit={handleRegister} autoComplete="off">
        <LoginReturnLink onClick={() => setCurrentAuthView('LOGIN')}>{t('« Return to login')}</LoginReturnLink>
        <PortName h4>{t('Port of {{portname}}', { portname: portName })}</PortName>
        <Heading h3>{t('Register as a new user')}</Heading>
        <GdprSection>{t('GDPR notice')}</GdprSection>
        {alert && <LoginAlert type={alert.type} message={alert.message} description={alert.description} />}
        <Input
          label={t('First name')}
          name={t('First name')}
          type="text"
          onChange={e => setInfo({ ...info, firstName: e.target.value })}
          autoFocus
          required
        />
        <Input
          label={t('Last name')}
          name={t('Last name')}
          type="text"
          onChange={e => setInfo({ ...info, lastName: e.target.value })}
          required
        />
        {!withoutCode && (
          <Input
            label={t('Code')}
            name={t('Code')}
            type="text"
            onChange={e => setInfo({ ...info, code: e.target.value })}
            required
          />
        )}
        <Input
          label={t('Email / Username')}
          name={t('Email')}
          type="text"
          onChange={e => setInfo({ ...info, email: e.target.value })}
          required
        />
        <Input
          label={t('Password')}
          name={t('Password')}
          type="password"
          onChange={e => setInfo({ ...info, password: e.target.value })}
          required
        />
        <Input
          label={t('Confirm password')}
          name={t('Confirm')}
          type="password"
          onChange={e => setInfo({ ...info, confirm: e.target.value })}
          required
        />
        <Button disabled={disabled}>{t('Register')}</Button>
      </LoginForm>
    </LoginWrapper>
  );
};

export default Register;
