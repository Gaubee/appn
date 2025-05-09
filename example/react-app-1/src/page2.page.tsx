import {AppnCommonTitleHeader, AppnPage, AppnView} from 'appn/react';
import React from 'react';
import {GoToHome, GoToPage1, GoToPage2} from './link';
export default function () {
  return (
    <AppnPage>
      <AppnCommonTitleHeader pageTitle="Page 2"></AppnCommonTitleHeader>

      <AppnView className="bg-amber-100">
        <GoToHome></GoToHome>
        <GoToPage1></GoToPage1>
        <GoToPage2></GoToPage2>
      </AppnView>
    </AppnPage>
  );
}
