import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface Props {
  width?: number;
  height?: number;
  style?: ImageStyle;
}

export const PaperPlaneView: React.FC<Props> = ({ width = 56, height = 48, style }) => {
  return (
    <Image
      source={require('../../../assets/paper-plane.png')}
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
};
