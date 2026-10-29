import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G, Line, Circle } from 'react-native-svg';
import { PALETTE } from '../../constants/theme';

interface Props {
  width: number;
  height: number;
  scrollOffset: number;
}

export const ParallaxBackground: React.FC<Props> = ({ width, height, scrollOffset }) => {
  // Layer parallax speeds
  const offsetDistant = (scrollOffset * 0.12) % width;
  const offsetMid = (scrollOffset * 0.28) % width;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {/* Base paper ivory background */}
        <Rect x="0" y="0" width={width} height={height} fill={PALETTE.paper} />

        {/* Faint travel-journal draft grid lines */}
        {Array.from({ length: Math.ceil(height / 48) }).map((_, i) => (
          <Line
            key={`grid-h-${i}`}
            x1="0"
            y1={i * 48}
            x2={width}
            y2={i * 48}
            stroke={PALETTE.paperFaintLine}
            strokeWidth="1"
          />
        ))}

        {/* ================= LAYER 1: DISTANT CLOUDS & RIDGES ================= */}
        <G transform={`translate(${-offsetDistant}, 0)`}>
          {/* Tile 1 */}
          <DistantLayer width={width} height={height} />
          {/* Tile 2 for seamless wrap */}
          <G transform={`translate(${width}, 0)`}>
            <DistantLayer width={width} height={height} />
          </G>
        </G>

        {/* ================= LAYER 2: MIDGROUND HILLS & ROOFTOPS ================= */}
        <G transform={`translate(${-offsetMid}, 0)`}>
          {/* Tile 1 */}
          <MidgroundLayer width={width} height={height} />
          {/* Tile 2 for seamless wrap */}
          <G transform={`translate(${width}, 0)`}>
            <MidgroundLayer width={width} height={height} />
          </G>
        </G>
      </Svg>
    </View>
  );
};

const DistantLayer: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const baseH = height * 0.72;
  return (
    <G>
      {/* Soft distant mountain ridge */}
      <Path
        d={`
          M 0 ${baseH}
          Q ${width * 0.2} ${baseH - 45} ${width * 0.45} ${baseH - 20}
          Q ${width * 0.7} ${baseH - 55} ${width} ${baseH - 15}
          L ${width} ${height}
          L 0 ${height} Z
        `}
        fill="#E4ECEB"
        opacity={0.8}
      />
      {/* Distant soft paper clouds */}
      <Circle cx={width * 0.2} cy={height * 0.22} r="28" fill="#FFF" opacity={0.65} />
      <Circle cx={width * 0.26} cy={height * 0.2} r="38" fill="#FFF" opacity={0.65} />
      <Circle cx={width * 0.33} cy={height * 0.23} r="26" fill="#FFF" opacity={0.65} />

      <Circle cx={width * 0.75} cy={height * 0.16} r="22" fill="#FFF" opacity={0.5} />
      <Circle cx={width * 0.8} cy={height * 0.14} r="32" fill="#FFF" opacity={0.5} />
      <Circle cx={width * 0.86} cy={height * 0.17} r="20" fill="#FFF" opacity={0.5} />
    </G>
  );
};

const MidgroundLayer: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const baseH = height * 0.85;
  return (
    <G>
      {/* Rolling teal-green foothills */}
      <Path
        d={`
          M 0 ${baseH}
          Q ${width * 0.25} ${baseH - 30} ${width * 0.55} ${baseH - 10}
          Q ${width * 0.8} ${baseH - 38} ${width} ${baseH - 12}
          L ${width} ${height}
          L 0 ${height} Z
        `}
        fill="#CADBD6"
        opacity={0.7}
      />

      {/* Tiny village silhouettes along the ridge */}
      {/* Little Windmill */}
      <Line x1={width * 0.3} y1={baseH - 22} x2={width * 0.3} y2={baseH - 40} stroke={PALETTE.inkMuted} strokeWidth="2" />
      <Line x1={width * 0.28} y1={baseH - 40} x2={width * 0.32} y2={baseH - 40} stroke={PALETTE.inkMuted} strokeWidth="1.5" />
      <Line x1={width * 0.26} y1={baseH - 44} x2={width * 0.34} y2={baseH - 36} stroke={PALETTE.inkMuted} strokeWidth="1" />
      <Line x1={width * 0.26} y1={baseH - 36} x2={width * 0.34} y2={baseH - 44} stroke={PALETTE.inkMuted} strokeWidth="1" />

      {/* Little Church Steeple */}
      <Path
        d={`
          M ${width * 0.65} ${baseH - 18}
          L ${width * 0.665} ${baseH - 38}
          L ${width * 0.68} ${baseH - 18} Z
        `}
        fill={PALETTE.inkMuted}
        opacity={0.6}
      />
      {/* Small tree cluster */}
      <Circle cx={width * 0.12} cy={baseH - 16} r="8" fill="#9FB5A8" opacity={0.8} />
      <Circle cx={width * 0.15} cy={baseH - 18} r="10" fill="#88A293" opacity={0.8} />
      <Circle cx={width * 0.88} cy={baseH - 24} r="9" fill="#9FB5A8" opacity={0.8} />
    </G>
  );
};
