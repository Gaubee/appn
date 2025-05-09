import {AppnCommonTitleHeader, AppnPage, AppnView} from 'appn/react';
import React from 'react';
import {GoToPage1, GoToPage2} from './link';
const HomePage = () => {
  return (
    <AppnPage>
      <AppnCommonTitleHeader pageTitle="Hello World!"></AppnCommonTitleHeader>
      <AppnView>
        <GoToPage1></GoToPage1>
        <GoToPage2></GoToPage2>
      </AppnView>
    </AppnPage>
  );
};
export default HomePage;
