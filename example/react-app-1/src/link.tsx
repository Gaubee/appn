import {AppnLink, AppnNavText} from 'appn/react';
import React from 'react';
export const GoToHome = () => (
  <AppnLink to="#">
    <AppnNavText>Home</AppnNavText>
  </AppnLink>
);
export const GoToPage1 = () => (
  <AppnLink to="#page1">
    <AppnNavText>Page 1</AppnNavText>
  </AppnLink>
);
export const GoToPage2 = () => (
  <AppnLink to="#page2">
    <AppnNavText>Page 2</AppnNavText>
  </AppnLink>
);
