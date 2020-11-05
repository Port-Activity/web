import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/browser';
import i18n from './i18n'; // eslint-disable-line
import WebFont from 'webfontloader';
import { ThemeProvider } from 'styled-components';

import { theme } from './theme/vars';
import GlobalStyle from './theme/globalStyle';

import { UserProvider } from './context/UserContext';
import Router from './router';

import Loader from './components/ui/Loader';
import { SENTRY_DSN } from './utils/constants';
import ErrorBoundary from './views/AppError';
import versionData from './version';
import { getEnvironmentName } from './utils/utils';

Sentry.init({
  debug: !!SENTRY_DSN && getEnvironmentName(document.location.hostname) === 'development',
  dsn: SENTRY_DSN,
  environment: getEnvironmentName(document.location.hostname),
  release: versionData.hash,
});

Sentry.setTags({
  version: versionData.version,
  build: versionData.build,
  ts: versionData.ts,
});

WebFont.load({
  google: { families: ['Open Sans:400,700'] },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <UserProvider>
            <Router />
          </UserProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
};

render(<App />, document.getElementById('root'));
