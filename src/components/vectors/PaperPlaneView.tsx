import React from 'react';
import Svg, { Polygon, G, Path } from 'react-native-svg';
import { PALETTE } from '../../constants/theme';

interface Props {
  width?: number;
  height?: number;
}

export const PaperPlaneView: React.FC<Props> = ({ width = 56, height = 34 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 68 44">
      <G>
        {/* Soft atmospheric paper shadow beneath the airplane */}
        <Path
          d="M 6 36 L 62 20 L 22 42 Z"
          fill="rgba(30, 44, 58, 0.16)"
        />

        {/* Center / underbody grip keel (the dark folded flap underneath) */}
        <Polygon
          points="20,20 28,34 40,18"
          fill={PALETTE.inkNavy}
          stroke={PALETTE.inkNavyDark}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Lower / far wing (facing down-left, in soft shadow) */}
        <Polygon
          points="62,16 12,32 20,20"
          fill="#DDD4C2"
          stroke={PALETTE.inkNavy}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Center fold crease spine */}
        <Polygon
          points="62,16 20,20 26,17"
          fill="#D0C4AF"
          stroke={PALETTE.inkNavy}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Main top wing (broad surface catching light) */}
        <Polygon
          points="62,16 6,6 20,20"
          fill="#FFFDF7"
          stroke={PALETTE.inkNavy}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner wing bevel / fold highlight */}
        <Polygon
          points="62,16 14,8 20,20"
          fill="#F5EFE3"
        />
      </G>
    </Svg>
  );
};
