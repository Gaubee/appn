import {AppnCommonTitleHeader, AppnLink, AppnNavText, AppnPage, AppnView} from 'appn/react';
import React from 'react';
export default function () {
  return (
    <AppnPage>
      <AppnCommonTitleHeader pageTitle="Page 1"></AppnCommonTitleHeader>

      <AppnView className="bg-cyan-100">
        <AppnLink to="#">
          <AppnNavText>Home</AppnNavText>
        </AppnLink>
        <AppnLink to="#page1">
          <AppnNavText>Page 1</AppnNavText>
        </AppnLink>
        <AppnLink to="#page2">
          <AppnNavText>Page 2</AppnNavText>
        </AppnLink>
      </AppnView>
    </AppnPage>
  );
}
