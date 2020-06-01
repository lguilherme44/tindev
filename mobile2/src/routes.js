import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';
import Home from './pages/Home';

export default createAppContainer(
  createSwitchNavigator({
    Login,
    Main,
    Home,
  })
);
