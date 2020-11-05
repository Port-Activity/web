import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { defaultPortList } from '../utils/constants';

import { UserContext } from '../context/UserContext';

import Heading from '../components/ui/Heading';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

import LoginWrapper from '../components/login/LoginWrapper';
import LoginLogo from '../components/login/LoginLogo';
import LoginForm from '../components/login/LoginForm';

const SelectPort = () => {
  const [hostnameChecked, setHostnameChecked] = useState(false);
  const { namespace, setNamespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    const map = {
      'qa-rauma.portactivity.fi': 'rauma',
      'rauma.portactivity.fi': 'rauma',
      'qa-gavle.portactivity.se': 'gavle',
      'gavle.portactivity.se': 'gavle',
      'www.portactivity.se': 'gavle',
      'portactivity.se': 'gavle',
      // "localhost": "rauma",
    };
    if (map[document.location.hostname]) {
      setNamespace(map[document.location.hostname]);
    }
    setHostnameChecked(true);
  }, [setHostnameChecked, setNamespace]);

  const initState = {
    port: 'gavle',
    ports: defaultPortList,
  };

  const [ports, setPorts] = useState(initState);

  const handleChange = e => {
    setPorts({ ...ports, port: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setNamespace(ports.port);
  };

  return !hostnameChecked ? (
    ''
  ) : (
    <LoginWrapper>
      <LoginLogo />
      <LoginForm onSubmit={handleSubmit}>
        <Heading h4>{t('Select Port')}</Heading>
        <Select
          label={t('Select Port')}
          name={t('Select Port')}
          options={ports.ports}
          defaultValue={ports.port}
          onChange={handleChange}
        />
        <Button>{t('Continue')}</Button>
      </LoginForm>
    </LoginWrapper>
  );
};

export default SelectPort;
