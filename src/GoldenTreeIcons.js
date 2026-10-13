import React from 'react';
import Svg, { Circle, Path, Line, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function GoldenTreeIcon({ name, size = 32, color = '#F6D477', filled = false }) {
  const line = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  let artwork;
  switch (name) {
    case 'Knowledge': case 'Learn':
      artwork = <G {...line}><Path d="M16 8C12 5 7 5 3 6v19c5-1 9-1 13 2 4-3 8-3 13-2V6c-4-1-9-1-13 2zM16 8v19M6 10c3-.4 5-.2 7 1M6 14c3-.4 5-.2 7 1M6 18c3-.4 5-.2 7 1M26 9v12" /></G>;
      break;
    case 'Understanding':
      artwork = <G {...line}><Path d="M16 7c-1-4-7-4-8 0-4 0-6 5-3 8-3 4 0 8 3 8 0 5 7 6 8 1M16 7c1-4 7-4 8 0 4 0 6 5 3 8 3 4 0 8-3 8 0 5-7 6-8 1M16 5v22M9 9c4-1 5 3 3 5M6 16c4-2 6 1 6 4M10 24c3-1 3-3 2-5M23 9c-4-1-5 3-3 5M26 16c-4-2-6 1-6 4M22 24c-3-1-3-3-2-5" /></G>;
      break;
    case 'Love': case 'Support':
      artwork = <Path {...line} d="M16 27C12 24 3 17 3 10 3 2 12 2 16 9c4-7 13-7 13 1 0 7-9 14-13 17z" />;
      break;
    case 'Kindness':
      artwork = <G {...line}><Path d="M16 14c-2-2-5-4-5-7 0-4 4-4 5-1 2-3 6-3 6 1 0 3-3 5-6 7zM7 28v-6L3 15V9c0-3 4-3 4 0v7l4 4M25 28v-6l4-7V9c0-3-4-3-4 0v7l-4 4M11 28v-4l-3-5c-2-3 1-5 3-2l4 5v6M21 28v-4l3-5c2-3-1-5-3-2l-4 5v6" /></G>;
      break;
    case 'Patience':
      artwork = <G {...line}><Path d="M7 4h18M7 28h18M9 4c0 8 3 9 7 12-4 3-7 4-7 12M23 4c0 8-3 9-7 12 4 3 7 4 7 12M10 9h12M10 25l6-6 6 6" /></G>;
      break;
    case 'Growth':
      artwork = <G {...line}><Path d="M16 29V15M16 21C7 21 3 15 3 8c8 0 13 5 13 13zM16 17C16 7 22 3 29 3c0 8-4 14-13 14zM7 12l9 9M25 7l-9 10" /></G>;
      break;
    case 'Humanity':
      artwork = <G {...line}><Circle cx="16" cy="8" r="4"/><Circle cx="5" cy="12" r="3"/><Circle cx="27" cy="12" r="3"/><Path d="M9 29v-9c0-9 14-9 14 0v9M1 29v-8c0-6 6-7 9-3M31 29v-8c0-6-6-7-9-3"/></G>;
      break;
    case 'Life':
      artwork = <><Defs><LinearGradient id="home-sun" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFF2AA"/><Stop offset="1" stopColor="#D99520"/></LinearGradient></Defs><Circle cx="16" cy="16" r="6" fill="url(#home-sun)" stroke={color} strokeWidth="1.2"/><G {...line}><Path d="M16 1v5M16 26v5M1 16h5M26 16h5M5.4 5.4l3.5 3.5M23.1 23.1l3.5 3.5M5.4 26.6l3.5-3.5M23.1 8.9l3.5-3.5"/></G></>;
      break;
    case 'Home':
      artwork = <Path d="M3 15L16 3l13 12h-4v14h-7v-9h-4v9H7V15z" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />;
      break;
    case 'Journey':
      artwork = <G {...line}><Path d="M12 29c-8-5-1-10 8-14 7-4 6-8 2-12M17 29c-7-4-2-7 5-11 10-6 7-12 3-15M8 28l-2 3M7 22l-2 2" /></G>;
      break;
    case 'More':
      artwork = <G fill={color}><Circle cx="5" cy="16" r="2"/><Circle cx="16" cy="16" r="2"/><Circle cx="27" cy="16" r="2"/></G>;
      break;
    case 'Menu':
      artwork = <G {...line}><Line x1="3" y1="7" x2="29" y2="7"/><Line x1="3" y1="16" x2="29" y2="16"/><Line x1="3" y1="25" x2="29" y2="25"/></G>;
      break;
    case 'Compass':
      artwork = <G {...line}><Circle cx="16" cy="16" r="13"/><Path d="M22 10l-4 8-8 4 4-8zM14 14l4 4"/></G>;
      break;
    case 'Lifebuoy':
      artwork = <G {...line}><Circle cx="16" cy="16" r="13"/><Circle cx="16" cy="16" r="7"/><Path d="M7 7l4 4M21 21l4 4M7 25l4-4M21 11l4-4"/></G>;
      break;
    case 'Arrow':
      artwork = <Path {...line} d="M4 16h24M21 9l7 7-7 7" />;
      break;
    case 'Chevron':
      artwork = <Path {...line} d="M12 6l10 10-10 10" />;
      break;
    default: artwork = null;
  }
  return <Svg width={size} height={size} viewBox="0 0 32 32" accessible={false}>{artwork}</Svg>;
}
