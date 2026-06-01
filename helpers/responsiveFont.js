import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const RFPercentage = percent => {
  return (height * percent) / 100;
};

export const RFValue = value => {
  const standardScreenHeight = 812;

  const heightPercent =
    (value * height) / standardScreenHeight;

  return Math.round(heightPercent);
};