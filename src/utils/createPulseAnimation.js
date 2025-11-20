const staticProp = (value, ix) => ({
  a: 0,
  k: value,
  ix,
});

const buildVectorKeyframe = (time, start, end) => ({
  t: time,
  s: start,
  e: end,
  i: {
    x: [0.667, 0.667, 0.667],
    y: [1, 1, 0],
  },
  o: {
    x: [0.333, 0.333, 0.333],
    y: [0, 0, 0],
  },
});

const buildScalarKeyframe = (time, start, end) => ({
  t: time,
  s: start,
  e: end,
  i: {
    x: [0.833],
    y: [0.833],
  },
  o: {
    x: [0.167],
    y: [0.167],
  },
});

const createScaleFrames = (start, peak, end, duration = 90, midpoint = duration / 2) => [
  buildVectorKeyframe(0, [start, start, 100], [peak, peak, 100]),
  buildVectorKeyframe(midpoint, [peak, peak, 100], [end, end, 100]),
  { t: duration },
];

const createOpacityFrames = (start, end, duration = 90) => [
  buildScalarKeyframe(0, [start], [end]),
  { t: duration },
];

const hexToUnitColor = (hex) => {
  const trimmed = hex.replace('#', '');
  const bigint = parseInt(trimmed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255, 1];
};

const createCircleLayer = ({
  index,
  name,
  color,
  size,
  hasStroke = false,
  strokeWidth = 8,
  scaleFrames,
  opacityFrames,
  duration = 90,
}) => ({
  ddd: 0,
  ind: index,
  ty: 4,
  nm: name,
  sr: 1,
  ks: {
    o: opacityFrames
      ? {
          a: 1,
          k: opacityFrames,
          ix: 11,
        }
      : staticProp(100, 11),
    r: staticProp(0, 10),
    p: staticProp([100, 100, 0], 2),
    a: staticProp([0, 0, 0], 1),
    s: {
      a: 1,
      k: scaleFrames,
      ix: 6,
    },
  },
  ao: 0,
  shapes: [
    {
      ty: 'gr',
      it: [
        {
          d: 1,
          ty: 'el',
          s: staticProp([size, size], 2),
          p: staticProp([0, 0], 3),
          nm: 'Ellipse Path 1',
          mn: 'ADBE Vector Shape - Ellipse',
          hd: false,
        },
        hasStroke
          ? {
              ty: 'st',
              c: staticProp(color, 4),
              o: staticProp(100, 5),
              w: staticProp(strokeWidth, 6),
              lc: 2,
              lj: 2,
              ml: 4,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false,
            }
          : {
              ty: 'fl',
              c: staticProp(color, 4),
              o: staticProp(100, 5),
              r: 1,
              bm: 0,
              nm: 'Fill 1',
              mn: 'ADBE Vector Graphic - Fill',
              hd: false,
            },
        {
          ty: 'tr',
          p: staticProp([0, 0], 2),
          a: staticProp([0, 0], 1),
          s: staticProp([100, 100], 3),
          r: staticProp(0, 6),
          o: staticProp(100, 7),
          sk: staticProp(0, 4),
          sa: staticProp(0, 5),
          nm: 'Transform',
        },
      ],
      nm: 'Ellipse 1',
      np: 3,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: 'ADBE Vector Group',
      hd: false,
    },
  ],
  ip: 0,
  op: duration,
  st: 0,
  bm: 0,
});

export const createPulseAnimation = (primaryHex, accentHex) => {
  const primaryColor = hexToUnitColor(primaryHex);
  const accentColor = hexToUnitColor(accentHex);

  const rippleLayer = createCircleLayer({
    index: 1,
    name: 'Ripple',
    color: accentColor,
    size: 170,
    hasStroke: true,
    strokeWidth: 10,
    scaleFrames: createScaleFrames(70, 130, 70),
    opacityFrames: createOpacityFrames(35, 0),
  });

  const coreLayer = createCircleLayer({
    index: 2,
    name: 'Core',
    color: primaryColor,
    size: 150,
    hasStroke: false,
    scaleFrames: createScaleFrames(80, 100, 80),
  });

  const sparkLayer = createCircleLayer({
    index: 3,
    name: 'Spark',
    color: accentColor,
    size: 70,
    hasStroke: false,
    scaleFrames: createScaleFrames(60, 80, 60, 90, 30),
  });

  return {
    v: '5.9.0',
    fr: 60,
    ip: 0,
    op: 90,
    w: 200,
    h: 200,
    nm: 'haemoji-pulse',
    ddd: 0,
    assets: [],
    layers: [rippleLayer, coreLayer, sparkLayer],
    markers: [],
  };
};
