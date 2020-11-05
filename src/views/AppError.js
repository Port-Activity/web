import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import Page from '../components/ui/Page';
import { withTranslation } from 'react-i18next';

// TODO: set namespace according to host
const NAMESPACE = 'common';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    const { i18n } = this.props;
    const t = i18n.getFixedT(i18n.language, NAMESPACE);

    if (this.state.hasError) {
      //render fallback UI
      return <Page title={t('Oops! Something went wrong.')}></Page>;
    }

    //when there's not an error, render children untouched
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
