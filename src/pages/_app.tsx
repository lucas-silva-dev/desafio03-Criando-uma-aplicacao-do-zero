// eslint-disable-next-line no-use-before-define
import React from 'react';
import { AppProps } from 'next/app';
import Header from '../components/Header';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
