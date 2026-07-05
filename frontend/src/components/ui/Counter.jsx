import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import './Counter.css';

function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value, place) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({ place, value, height, digitStyle }) {
  const isDecimal = place === '.';
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place);

  // Start from 0 so the spring animates up to the real value on mount
  const animatedValue = useSpring(0, { stiffness: 80, damping: 18, mass: 1 });

  useEffect(() => {
    if (!isDecimal) animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}>
        .
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

/**
 * Animated rolling-digit counter.
 *
 * @param {object} props
 * @param {number}   props.value             — numeric value to display (required)
 * @param {number}   [props.fontSize=40]     — font size in px
 * @param {number}   [props.padding=0]       — extra height added to each digit slot
 * @param {number[]} [props.places]          — digit place values (auto-detected if omitted)
 * @param {number}   [props.gap=4]           — gap between digits in px
 * @param {number}   [props.borderRadius=4]
 * @param {number}   [props.horizontalPadding=4]
 * @param {string}   [props.textColor='inherit']
 * @param {string|number} [props.fontWeight='inherit']
 * @param {object}   [props.containerStyle]
 * @param {object}   [props.counterStyle]
 * @param {object}   [props.digitStyle]
 * @param {number}   [props.gradientHeight=0]    — set >0 to show top/bottom fade
 * @param {string}   [props.gradientFrom='transparent']
 * @param {string}   [props.gradientTo='transparent']
 * @param {object}   [props.topGradientStyle]
 * @param {object}   [props.bottomGradientStyle]
 */
export default function Counter({
  value,
  fontSize = 40,
  padding = 0,
  places,
  gap = 4,
  borderRadius = 4,
  horizontalPadding = 4,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 0,
  gradientFrom = 'transparent',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle,
}) {
  // Auto-detect place values from the number string if not provided
  const resolvedPlaces =
    places ||
    [...value.toString()].map((ch, i, a) => {
      if (ch === '.') return '.';
      const dotIdx = a.indexOf('.');
      if (dotIdx === -1) return 10 ** (a.length - i - 1);
      if (i < dotIdx) return 10 ** (dotIdx - i - 1);
      return 10 ** -(i - dotIdx);
    });

  const height = fontSize + padding;

  const defaultCounterStyle = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: 'ltr',
  };

  const defaultTopGradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };

  const defaultBottomGradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {resolvedPlaces.map((place, idx) => (
          <Digit key={idx} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      {gradientHeight > 0 && (
        <span className="gradient-container">
          <span
            className="top-gradient"
            style={topGradientStyle ?? defaultTopGradientStyle}
          />
          <span
            className="bottom-gradient"
            style={bottomGradientStyle ?? defaultBottomGradientStyle}
          />
        </span>
      )}
    </span>
  );
}
