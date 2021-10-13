import { hot } from 'react-hot-loader/root';
import React from 'react';
import Popup from 'views/popup';
import '../assets/styles/base.less';
const routes = {
  popup: {
    View: Popup,
  }
};

const APP = ({ path }) => {
  let { View } = routes[path];
  return (
    <View />
  )
};

export default hot(APP);