import React from 'react';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';
import { PALETTE } from '../../constants/theme';

interface Props {
  size?: number;
  highlighted?: boolean;
}

export const PostageStampView: React.FC<Props> = ({ size = 26, highlighted = false }) => {
  return (
    <Svg width={size} height={size * 1.15} viewBox="0 0 32 37">
      <G>
        {/* Soft stamp shadow */}
        <Rect
          x="3"
          y="3"
          width="26"
          height="31"
          rx="1"
          fill="rgba(30, 44, 58, 0.15)"
        />

        {/* Stamp perforated background (Ivory paper with perforated borders) */}
        <Path
          d="
            M 3 5 
            Q 3 3 5 3 
            Q 6 1 7 3 Q 8 1 9 3 Q 10 1 11 3 Q 12 1 13 3 Q 14 1 15 3 Q 16 1 17 3 Q 18 1 19 3 Q 20 1 21 3 Q 22 1 23 3 Q 24 1 25 3 
            Q 27 3 27 5 
            Q 29 6 27 7 Q 29 8 27 9 Q 29 10 27 11 Q 29 12 27 13 Q 29 14 27 15 Q 29 16 27 17 Q 29 18 27 19 Q 29 20 27 21 Q 29 22 27 23 Q 29 24 27 25 Q 29 26 27 27 Q 29 28 27 29 Q 29 30 27 31
            Q 27 33 25 33 
            Q 24 35 23 33 Q 22 35 21 33 Q 20 35 19 33 Q 18 35 17 33 Q 16 35 15 33 Q 14 35 13 33 Q 12 35 11 33 Q 10 35 9 33 Q 8 35 7 33 Q 6 35 5 33
            Q 3 33 3 31
            Q 1 30 3 29 Q 1 28 3 27 Q 1 26 3 25 Q 1 24 3 23 Q 1 22 3 21 Q 1 20 3 19 Q 1 18 3 17 Q 1 16 3 15 Q 1 14 3 13 Q 1 12 3 11 Q 1 10 3 9 Q 1 8 3 7 Q 1 6 3 5
            Z
          "
          fill="#FFFDF7"
          stroke={PALETTE.paperBorder}
          strokeWidth="0.8"
        />

        {/* Inner Stamp Vignette Border */}
        <Rect
          x="5"
          y="5"
          width="20"
          height="25"
          fill={highlighted ? PALETTE.vintageCoralLight : PALETTE.airmailBlueLight}
          stroke={highlighted ? PALETTE.vintageCoral : PALETTE.airmailBlue}
          strokeWidth="0.9"
        />

        {/* Vintage Bird/Wing engraving symbol in center */}
        <Path
          d="M 9 17 C 12 12, 16 13, 21 16 C 18 18, 14 17, 9 17 Z"
          fill={highlighted ? PALETTE.vintageCoral : PALETTE.airmailBlue}
        />
        <Path
          d="M 12 18 C 15 15, 18 16, 21 18"
          stroke="#FFF"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Little Post Value "5¢" or "★" */}
        <Circle
          cx="15"
          cy="25"
          r="2.5"
          fill={highlighted ? PALETTE.vintageCoral : PALETTE.airmailBlue}
        />

        {/* Cancellation postmark wavy lines */}
        <Path
          d="M 14 7 Q 18 9 22 7 M 16 10 Q 20 12 24 10"
          stroke="rgba(30, 44, 58, 0.45)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};
