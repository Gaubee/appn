import {AppnCommonTitleHeader, AppnLink, AppnNavText, AppnPage, AppnView} from 'appn/react';
import React from 'react';
const HomePage = () => {
  return (
    <AppnPage>
      <AppnCommonTitleHeader pageTitle="Hello World!"></AppnCommonTitleHeader>
      <AppnView>
        <AppnLink to="#page1">
          <AppnNavText>Page 1</AppnNavText>
        </AppnLink>
        <AppnLink to="#page2">
          <AppnNavText>Page 2</AppnNavText>
        </AppnLink>
      </AppnView>
    </AppnPage>
  );
};
export default HomePage;
