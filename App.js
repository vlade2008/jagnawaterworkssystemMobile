import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { LocaleProvider } from 'antd-mobile'

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppWithNavigationState';
// import { middleware } from './src/utils/redux';
import thunk from 'redux-thunk'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
const store = createStore(
  AppReducer,
  applyMiddleware(thunk),
);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <LocaleProvider locale={enUS}>
          <AppWithNavigationState />
        </LocaleProvider>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('App', () => App);

export default App;
