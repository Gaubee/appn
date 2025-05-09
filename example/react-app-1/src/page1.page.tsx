import {AppnCommonTitleHeader, AppnPage, AppnView} from 'appn/react';
import React from 'react';
import {GoToHome, GoToPage1, GoToPage2} from './link';
export default function () {
  return (
    <AppnPage>
      <AppnCommonTitleHeader pageTitle="Page 1"></AppnCommonTitleHeader>

      <AppnView className="bg-cyan-100">
        <GoToHome></GoToHome>
        <GoToPage1></GoToPage1>
        <GoToPage2></GoToPage2>
      </AppnView>
    </AppnPage>
  );
}
