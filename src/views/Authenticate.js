import React, { useContext } from 'react';

import { defaultPortList } from '../utils/constants';

import { UserContext } from '../context/UserContext';

import Loader from '../components/ui/Loader';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import Register from './Register';
import SelectPort from './SelectPort';

const Authenticate = () => {
  const { currentAuthView, namespace } = useContext(UserContext);

  let portName = '';
  let authView = currentAuthView;

  if (!namespace || namespace === 'common') {
    authView = 'SELECT_PORT';
  } else {
    const port = defaultPortList.find(port => port.key === namespace);
    if (port) {
      portName = port.label;
    }
  }

  switch (authView) {
    case 'SELECT_PORT':
      return <SelectPort />;

    case 'LOGIN':
      return <Login portName={portName} />;

    case 'REGISTER':
      return <Register portName={portName} withoutCode={false} />;

    case 'REGISTER_WITHOUT_CODE':
      return <Register portName={portName} withoutCode={true} />;

    case 'FORGOT_PASSWORD':
      return <ForgotPassword portName={portName} />;

    default:
      return <Loader />;
  }
};

export default Authenticate;
