import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Polygon, Line, G, Circle } from 'react-native-svg';
import { Obstacle } from '../../types/game';
import { PALETTE } from '../../constants/theme';

interface Props {
  obstacle: Obstacle;
  totalHeight: number;
}

export const ObstacleView: React.FC<Props> = ({ obstacle, totalHeight }) => {
  const { width, topGap, bottomGap, type } = obstacle;
  const bottomHeight = Math.max(0, totalHeight - bottomGap);

  return (
    <View
      style={{
        position: 'absolute',
        left: obstacle.x,
        top: 0,
        width,
        height: totalHeight,
      }}
      pointerEvents="none"
    >
      {/* ================= TOP OBSTACLE ================= */}
      {topGap > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height: topGap,
            overflow: 'hidden',
          }}
        >
          <Svg width={width} height={topGap} viewBox={`0 0 ${width} ${topGap}`}>
            {type === 'cloud' && (
              <G>
                {/* Cloud mass from above */}
                <Rect x="0" y="0" width={width} height={topGap - 16} fill="#F2EFE8" />
                <Path
                  d={`
                    M 0 ${topGap - 16}
                    Q ${width * 0.25} ${topGap + 4} ${width * 0.5} ${topGap - 10}
                    Q ${width * 0.75} ${topGap + 6} ${width} ${topGap - 14}
                    L ${width} 0 L 0 0 Z
                  `}
                  fill="#FFF"
                  stroke={PALETTE.paperBorder}
                  strokeWidth="1.5"
                />
                {/* Delicate ink hatching rain lines beneath cloud */}
                <Line x1={width * 0.2} y1={topGap - 6} x2={width * 0.15} y2={topGap - 1} stroke={PALETTE.inkFaint} strokeWidth="1" strokeDasharray="2,3" />
                <Line x1={width * 0.5} y1={topGap - 5} x2={width * 0.45} y2={topGap} stroke={PALETTE.inkFaint} strokeWidth="1" strokeDasharray="2,3" />
                <Line x1={width * 0.8} y1={topGap - 7} x2={width * 0.75} y2={topGap - 2} stroke={PALETTE.inkFaint} strokeWidth="1" strokeDasharray="2,3" />
              </G>
            )}

            {type === 'pencil' && (
              <G>
                {/* Vintage wooden drafting ruler / brass plummet descending */}
                <Rect
                  x={width * 0.2}
                  y="0"
                  width={width * 0.6}
                  height={topGap - 18}
                  fill="#EADECC"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Ruler tick marks */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <Line
                    key={i}
                    x1={width * 0.2}
                    y1={15 + i * 16}
                    x2={width * (i % 2 === 0 ? 0.45 : 0.35)}
                    y2={15 + i * 16}
                    stroke={PALETTE.inkNavy}
                    strokeWidth="1"
                  />
                ))}
                {/* Brass / ink nib pointing down */}
                <Polygon
                  points={`${width * 0.2},${topGap - 18} ${width * 0.8},${topGap - 18} ${width * 0.5},${topGap}`}
                  fill={PALETTE.inkNavy}
                />
                <Circle cx={width * 0.5} cy={topGap - 8} r="2" fill="#EADECC" />
              </G>
            )}

            {(type === 'steeples' || type === 'weathervane' || type === 'kite') && (
              <G>
                {/* Airmail ribbon or letter hanging from the sky */}
                <Rect
                  x={width * 0.15}
                  y="0"
                  width={width * 0.7}
                  height={topGap - 10}
                  fill="#FDFCF8"
                  stroke={PALETTE.paperBorder}
                  strokeWidth="1.2"
                />
                {/* Diagonal airmail barber pole stripe */}
                <Line x1={width * 0.15} y1="0" x2={width * 0.85} y2={topGap - 10} stroke={PALETTE.vintageCoral} strokeWidth="2.5" />
                <Line x1={width * 0.85} y1="0" x2={width * 0.15} y2={topGap - 10} stroke={PALETTE.airmailBlue} strokeWidth="2.5" />
                {/* Envelope fold flap pointing down */}
                <Polygon
                  points={`${width * 0.15},${topGap - 10} ${width * 0.85},${topGap - 10} ${width * 0.5},${topGap}`}
                  fill="#F2EAD9"
                  stroke={PALETTE.paperBorder}
                  strokeWidth="1.2"
                />
                <Circle cx={width * 0.5} cy={topGap - 4} r="2" fill={PALETTE.vintageCoral} />
              </G>
            )}
          </Svg>
        </View>
      )}

      {/* ================= BOTTOM OBSTACLE ================= */}
      {bottomHeight > 0 && (
        <View
          style={{
            position: 'absolute',
            top: bottomGap,
            left: 0,
            width,
            height: bottomHeight,
            overflow: 'hidden',
          }}
        >
          <Svg width={width} height={bottomHeight} viewBox={`0 0 ${width} ${bottomHeight}`}>
            {type === 'pencil' ? (
              <G>
                {/* Cedar pencil tip pointing up */}
                <Polygon
                  points={`${width * 0.5},0 ${width * 0.15},26 ${width * 0.85},26`}
                  fill="#D9B78A"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Graphite lead tip */}
                <Polygon
                  points={`${width * 0.5},0 ${width * 0.35},12 ${width * 0.65},12`}
                  fill={PALETTE.inkNavy}
                />
                {/* Pencil body */}
                <Rect
                  x={width * 0.15}
                  y="26"
                  width={width * 0.7}
                  height={bottomHeight - 26}
                  fill="#3B6B73"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Pencil facet lines */}
                <Line x1={width * 0.38} y1="26" x2={width * 0.38} y2={bottomHeight} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                <Line x1={width * 0.62} y1="26" x2={width * 0.62} y2={bottomHeight} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              </G>
            ) : type === 'steeples' ? (
              <G>
                {/* Gothic / European town clock spire */}
                <Polygon
                  points={`${width * 0.5},0 ${width * 0.15},38 ${width * 0.85},38`}
                  fill="#4F6D7A"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Tiny cross / finial on peak */}
                <Line x1={width * 0.5} y1="0" x2={width * 0.5} y2="8" stroke={PALETTE.sepiaGold} strokeWidth="1.5" />
                <Line x1={width * 0.42} y1="3" x2={width * 0.58} y2="3" stroke={PALETTE.sepiaGold} strokeWidth="1.5" />

                {/* Spire tower body */}
                <Rect
                  x={width * 0.2}
                  y="38"
                  width={width * 0.6}
                  height={bottomHeight - 38}
                  fill="#E6DAC8"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Clock face */}
                <Circle cx={width * 0.5} cy="56" r="9" fill="#FFFDF8" stroke={PALETTE.inkNavy} strokeWidth="1" />
                <Line x1={width * 0.5} y1="56" x2={width * 0.5} y2="50" stroke={PALETTE.inkNavy} strokeWidth="1.2" />
                <Line x1={width * 0.5} y1="56" x2={width * 0.58} y2="56" stroke={PALETTE.inkNavy} strokeWidth="1.2" />
                {/* Belfry arches */}
                <Rect x={width * 0.35} y="74" width={width * 0.3} height="18" rx="4" fill="#3B4A54" />
              </G>
            ) : type === 'weathervane' ? (
              <G>
                {/* Weather vane / windmill mast */}
                <Line x1={width * 0.5} y1="0" x2={width * 0.5} y2="32" stroke={PALETTE.inkNavy} strokeWidth="2" />
                {/* Cardinal directions cross */}
                <Line x1={width * 0.2} y1="12" x2={width * 0.8} y2="12" stroke={PALETTE.inkNavy} strokeWidth="1.5" />
                {/* Little rooster or arrow silhouette */}
                <Polygon
                  points={`${width * 0.2},12 ${width * 0.3},7 ${width * 0.3},17`}
                  fill={PALETTE.vintageCoral}
                />
                {/* Terracotta cottage roof */}
                <Polygon
                  points={`${width * 0.5},32 0,72 ${width},72`}
                  fill="#C25942"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Chimney */}
                <Rect x={width * 0.65} y="22" width="10" height="20" fill="#8C3A27" stroke={PALETTE.inkNavy} strokeWidth="1" />
                {/* House base */}
                <Rect x={width * 0.1} y="72" width={width * 0.8} height={bottomHeight - 72} fill="#F0E8D8" stroke={PALETTE.inkNavy} strokeWidth="1.2" />
                <Rect x={width * 0.35} y="82" width={width * 0.3} height="16" fill="#4A6572" />
              </G>
            ) : (
              <G>
                {/* Rolling hillside with pine trees */}
                <Path
                  d={`
                    M 0 24
                    Q ${width * 0.4} 6 ${width} 18
                    L ${width} ${bottomHeight}
                    L 0 ${bottomHeight} Z
                  `}
                  fill="#8CA394"
                  stroke={PALETTE.inkNavy}
                  strokeWidth="1.2"
                />
                {/* Pine tree silhouette */}
                <Polygon
                  points={`${width * 0.4},8 ${width * 0.2},28 ${width * 0.6},28`}
                  fill="#476353"
                />
                <Polygon
                  points={`${width * 0.7},14 ${width * 0.55},32 ${width * 0.85},32`}
                  fill="#3B5445"
                />
              </G>
            )}
          </Svg>
        </View>
      )}
    </View>
  );
};
