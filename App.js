


import 'react-native-gesture-handler';
import React from 'react';
import { View, } from 'react-native';
import Navigator from './Navigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
const App = () => {
  return (
    <Provider store={store} >
      <View style={{ flex: 1 }}>
        <Navigator />
      </View>
    </Provider>
  );
};

export default App;








