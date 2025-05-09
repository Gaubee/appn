import {AppnNavigationProvider, AppnThemeProvider, AppRoute} from 'appn/react';
import React from 'react';
// import HomePage from './home.page';
// import Page1Page from './page1.page';
// import Page2Page from './page2.page';
export const App = () => {
  return (
    <React.StrictMode>
      <AppnThemeProvider theme="ios">
        <AppnNavigationProvider>
          <AppRoute hash="" loader={() => import('./home.page')}></AppRoute>
          <AppRoute hash="#page1" loader={() => import('./page1.page')}></AppRoute>
          <AppRoute hash="#page2" loader={() => import('./page2.page')}></AppRoute>
          <AppRoute hash="*" loader={() => import('./home.page')}></AppRoute>
          </AppnNavigationProvider>
      </AppnThemeProvider>
    </React.StrictMode>
  );
};
