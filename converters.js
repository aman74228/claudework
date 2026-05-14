/* ============================================================
   UnitX — Conversion Data & Formulas
   ============================================================ */

const CURRENCY_RATES = {
  USD: { rate: 1,          name: 'US Dollar',           flag: '🇺🇸', code: 'USD' },
  EUR: { rate: 0.9246,     name: 'Euro',                flag: '🇪🇺', code: 'EUR' },
  GBP: { rate: 0.7921,     name: 'British Pound',       flag: '🇬🇧', code: 'GBP' },
  JPY: { rate: 149.52,     name: 'Japanese Yen',        flag: '🇯🇵', code: 'JPY' },
  CAD: { rate: 1.3618,     name: 'Canadian Dollar',     flag: '🇨🇦', code: 'CAD' },
  AUD: { rate: 1.5321,     name: 'Australian Dollar',   flag: '🇦🇺', code: 'AUD' },
  CHF: { rate: 0.8875,     name: 'Swiss Franc',         flag: '🇨🇭', code: 'CHF' },
  CNY: { rate: 7.2415,     name: 'Chinese Yuan',        flag: '🇨🇳', code: 'CNY' },
  INR: { rate: 83.24,      name: 'Indian Rupee',        flag: '🇮🇳', code: 'INR' },
  MXN: { rate: 17.05,      name: 'Mexican Peso',        flag: '🇲🇽', code: 'MXN' },
  BRL: { rate: 4.9756,     name: 'Brazilian Real',      flag: '🇧🇷', code: 'BRL' },
  KRW: { rate: 1325.80,    name: 'South Korean Won',    flag: '🇰🇷', code: 'KRW' },
  SGD: { rate: 1.3401,     name: 'Singapore Dollar',    flag: '🇸🇬', code: 'SGD' },
  HKD: { rate: 7.8236,     name: 'Hong Kong Dollar',    flag: '🇭🇰', code: 'HKD' },
  NOK: { rate: 10.5614,    name: 'Norwegian Krone',     flag: '🇳🇴', code: 'NOK' },
  SEK: { rate: 10.4021,    name: 'Swedish Krona',       flag: '🇸🇪', code: 'SEK' },
  DKK: { rate: 6.8901,     name: 'Danish Krone',        flag: '🇩🇰', code: 'DKK' },
  NZD: { rate: 1.6301,     name: 'New Zealand Dollar',  flag: '🇳🇿', code: 'NZD' },
  ZAR: { rate: 18.6451,    name: 'South African Rand',  flag: '🇿🇦', code: 'ZAR' },
  AED: { rate: 3.6726,     name: 'UAE Dirham',          flag: '🇦🇪', code: 'AED' },
  SAR: { rate: 3.7502,     name: 'Saudi Riyal',         flag: '🇸🇦', code: 'SAR' },
  TRY: { rate: 32.1204,    name: 'Turkish Lira',        flag: '🇹🇷', code: 'TRY' },
  THB: { rate: 35.0123,    name: 'Thai Baht',           flag: '🇹🇭', code: 'THB' },
  MYR: { rate: 4.7123,     name: 'Malaysian Ringgit',   flag: '🇲🇾', code: 'MYR' },
  IDR: { rate: 15623.45,   name: 'Indonesian Rupiah',   flag: '🇮🇩', code: 'IDR' },
  PHP: { rate: 56.1234,    name: 'Philippine Peso',     flag: '🇵🇭', code: 'PHP' },
  VND: { rate: 24512.34,   name: 'Vietnamese Dong',     flag: '🇻🇳', code: 'VND' },
  EGP: { rate: 30.9021,    name: 'Egyptian Pound',      flag: '🇪🇬', code: 'EGP' },
  PKR: { rate: 278.123,    name: 'Pakistani Rupee',     flag: '🇵🇰', code: 'PKR' },
  BDT: { rate: 109.45,     name: 'Bangladeshi Taka',    flag: '🇧🇩', code: 'BDT' },
  NGN: { rate: 1285.00,    name: 'Nigerian Naira',      flag: '🇳🇬', code: 'NGN' },
};

const CATEGORIES = [
  /* ── LENGTH ─────────────────────────────────────────────── */
  {
    id: 'length', name: 'Length', icon: '📏',
    color: '#3b82f6', gradient: ['#3b82f6','#6366f1'],
    description: 'Distances & dimensions',
    type: 'linear', baseUnit: 'm',
    units: [
      { id:'pm',  name:'Picometer',        symbol:'pm',  factor:1e-12  },
      { id:'nm',  name:'Nanometer',        symbol:'nm',  factor:1e-9   },
      { id:'um',  name:'Micrometer',       symbol:'μm',  factor:1e-6   },
      { id:'mm',  name:'Millimeter',       symbol:'mm',  factor:0.001  },
      { id:'cm',  name:'Centimeter',       symbol:'cm',  factor:0.01   },
      { id:'dm',  name:'Decimeter',        symbol:'dm',  factor:0.1    },
      { id:'m',   name:'Meter',            symbol:'m',   factor:1      },
      { id:'km',  name:'Kilometer',        symbol:'km',  factor:1000   },
      { id:'in',  name:'Inch',             symbol:'in',  factor:0.0254 },
      { id:'ft',  name:'Foot',             symbol:'ft',  factor:0.3048 },
      { id:'yd',  name:'Yard',             symbol:'yd',  factor:0.9144 },
      { id:'mi',  name:'Mile',             symbol:'mi',  factor:1609.344 },
      { id:'nmi', name:'Nautical Mile',    symbol:'nmi', factor:1852   },
      { id:'au',  name:'Astronomical Unit',symbol:'AU',  factor:1.496e11 },
      { id:'ly',  name:'Light Year',       symbol:'ly',  factor:9.461e15 },
    ]
  },

  /* ── WEIGHT ──────────────────────────────────────────────── */
  {
    id: 'weight', name: 'Weight & Mass', icon: '⚖️',
    color: '#10b981', gradient: ['#10b981','#06b6d4'],
    description: 'Mass & weight units',
    type: 'linear', baseUnit: 'kg',
    units: [
      { id:'ug',     name:'Microgram',      symbol:'μg',  factor:1e-9      },
      { id:'mg',     name:'Milligram',      symbol:'mg',  factor:1e-6      },
      { id:'g',      name:'Gram',           symbol:'g',   factor:0.001     },
      { id:'kg',     name:'Kilogram',       symbol:'kg',  factor:1         },
      { id:'t',      name:'Metric Ton',     symbol:'t',   factor:1000      },
      { id:'oz',     name:'Ounce',          symbol:'oz',  factor:0.0283495 },
      { id:'lb',     name:'Pound',          symbol:'lb',  factor:0.453592  },
      { id:'st',     name:'Stone',          symbol:'st',  factor:6.35029   },
      { id:'ton_us', name:'Short Ton (US)', symbol:'ton', factor:907.185   },
      { id:'ton_uk', name:'Long Ton (UK)',  symbol:'LT',  factor:1016.05   },
      { id:'carat',  name:'Carat',          symbol:'ct',  factor:0.0002    },
    ]
  },

  /* ── TEMPERATURE ─────────────────────────────────────────── */
  {
    id: 'temperature', name: 'Temperature', icon: '🌡️',
    color: '#f59e0b', gradient: ['#f59e0b','#ef4444'],
    description: 'Heat & cold',
    type: 'special',
    units: [
      { id:'c', name:'Celsius',    symbol:'°C' },
      { id:'f', name:'Fahrenheit', symbol:'°F' },
      { id:'k', name:'Kelvin',     symbol:'K'  },
      { id:'r', name:'Rankine',    symbol:'°R' },
    ],
    convert(value, from, to) {
      let c;
      switch(from) {
        case 'c': c = value; break;
        case 'f': c = (value - 32) * 5/9; break;
        case 'k': c = value - 273.15; break;
        case 'r': c = (value - 491.67) * 5/9; break;
        default: return NaN;
      }
      switch(to) {
        case 'c': return c;
        case 'f': return c * 9/5 + 32;
        case 'k': return c + 273.15;
        case 'r': return (c + 273.15) * 9/5;
        default: return NaN;
      }
    }
  },

  /* ── AREA ────────────────────────────────────────────────── */
  {
    id: 'area', name: 'Area', icon: '🗺️',
    color: '#14b8a6', gradient: ['#14b8a6','#3b82f6'],
    description: 'Surface measurements',
    type: 'linear', baseUnit: 'm2',
    units: [
      { id:'mm2', name:'Square Millimeter', symbol:'mm²', factor:1e-6       },
      { id:'cm2', name:'Square Centimeter', symbol:'cm²', factor:1e-4       },
      { id:'m2',  name:'Square Meter',      symbol:'m²',  factor:1          },
      { id:'km2', name:'Square Kilometer',  symbol:'km²', factor:1e6        },
      { id:'in2', name:'Square Inch',       symbol:'in²', factor:6.4516e-4  },
      { id:'ft2', name:'Square Foot',       symbol:'ft²', factor:0.092903   },
      { id:'yd2', name:'Square Yard',       symbol:'yd²', factor:0.836127   },
      { id:'mi2', name:'Square Mile',       symbol:'mi²', factor:2.589988e6 },
      { id:'acre',name:'Acre',              symbol:'ac',  factor:4046.86    },
      { id:'ha',  name:'Hectare',           symbol:'ha',  factor:10000      },
    ]
  },

  /* ── VOLUME ──────────────────────────────────────────────── */
  {
    id: 'volume', name: 'Volume', icon: '🧪',
    color: '#06b6d4', gradient: ['#06b6d4','#3b82f6'],
    description: 'Liquid & solid volumes',
    type: 'linear', baseUnit: 'l',
    units: [
      { id:'ml',      name:'Milliliter',      symbol:'mL',     factor:0.001     },
      { id:'cl',      name:'Centiliter',      symbol:'cL',     factor:0.01      },
      { id:'dl',      name:'Deciliter',       symbol:'dL',     factor:0.1       },
      { id:'l',       name:'Liter',           symbol:'L',      factor:1         },
      { id:'m3',      name:'Cubic Meter',     symbol:'m³',     factor:1000      },
      { id:'cm3',     name:'Cubic Centimeter',symbol:'cm³',    factor:0.001     },
      { id:'in3',     name:'Cubic Inch',      symbol:'in³',    factor:0.016387  },
      { id:'ft3',     name:'Cubic Foot',      symbol:'ft³',    factor:28.3168   },
      { id:'floz',    name:'Fluid Oz (US)',   symbol:'fl oz',  factor:0.029574  },
      { id:'cup',     name:'Cup (US)',         symbol:'cup',    factor:0.236588  },
      { id:'pt',      name:'Pint (US)',        symbol:'pt',     factor:0.473176  },
      { id:'qt',      name:'Quart (US)',       symbol:'qt',     factor:0.946353  },
      { id:'gal_us',  name:'Gallon (US)',      symbol:'gal',    factor:3.78541   },
      { id:'gal_uk',  name:'Gallon (UK)',      symbol:'UK gal', factor:4.54609   },
      { id:'tsp',     name:'Teaspoon (US)',    symbol:'tsp',    factor:0.004929  },
      { id:'tbsp',    name:'Tablespoon (US)',  symbol:'tbsp',   factor:0.014787  },
    ]
  },

  /* ── SPEED ───────────────────────────────────────────────── */
  {
    id: 'speed', name: 'Speed', icon: '🚀',
    color: '#ef4444', gradient: ['#ef4444','#f59e0b'],
    description: 'Velocity & pace',
    type: 'linear', baseUnit: 'ms',
    units: [
      { id:'ms',    name:'Meter/Second',   symbol:'m/s',  factor:1        },
      { id:'kmh',   name:'Kilometer/Hour', symbol:'km/h', factor:0.277778 },
      { id:'mph',   name:'Mile/Hour',      symbol:'mph',  factor:0.44704  },
      { id:'kt',    name:'Knot',           symbol:'kn',   factor:0.514444 },
      { id:'fts',   name:'Foot/Second',    symbol:'ft/s', factor:0.3048   },
      { id:'mach',  name:'Mach',           symbol:'Ma',   factor:340.29   },
      { id:'c_spd', name:'Speed of Light', symbol:'c',    factor:299792458},
    ]
  },

  /* ── TIME ────────────────────────────────────────────────── */
  {
    id: 'time', name: 'Time', icon: '⏱️',
    color: '#8b5cf6', gradient: ['#8b5cf6','#6366f1'],
    description: 'Duration & intervals',
    type: 'linear', baseUnit: 's',
    units: [
      { id:'ns',      name:'Nanosecond',  symbol:'ns',   factor:1e-9     },
      { id:'us',      name:'Microsecond', symbol:'μs',   factor:1e-6     },
      { id:'ms_t',    name:'Millisecond', symbol:'ms',   factor:0.001    },
      { id:'s',       name:'Second',      symbol:'s',    factor:1        },
      { id:'min',     name:'Minute',      symbol:'min',  factor:60       },
      { id:'h',       name:'Hour',        symbol:'h',    factor:3600     },
      { id:'d',       name:'Day',         symbol:'d',    factor:86400    },
      { id:'w',       name:'Week',        symbol:'wk',   factor:604800   },
      { id:'mo',      name:'Month',       symbol:'mo',   factor:2629800  },
      { id:'yr',      name:'Year',        symbol:'yr',   factor:31557600 },
      { id:'decade',  name:'Decade',      symbol:'dec',  factor:315576000},
      { id:'century', name:'Century',     symbol:'cen',  factor:3.1558e9 },
    ]
  },

  /* ── DATA STORAGE ────────────────────────────────────────── */
  {
    id: 'data', name: 'Data Storage', icon: '💾',
    color: '#6366f1', gradient: ['#6366f1','#8b5cf6'],
    description: 'Digital storage sizes',
    type: 'linear', baseUnit: 'b',
    units: [
      { id:'bit', name:'Bit',      symbol:'bit', factor:0.125          },
      { id:'b',   name:'Byte',     symbol:'B',   factor:1              },
      { id:'kb',  name:'Kilobyte', symbol:'KB',  factor:1024           },
      { id:'mb',  name:'Megabyte', symbol:'MB',  factor:1048576        },
      { id:'gb',  name:'Gigabyte', symbol:'GB',  factor:1073741824     },
      { id:'tb',  name:'Terabyte', symbol:'TB',  factor:1.099512e12    },
      { id:'pb',  name:'Petabyte', symbol:'PB',  factor:1.125900e15    },
      { id:'eb',  name:'Exabyte',  symbol:'EB',  factor:1.152922e18    },
      { id:'kib', name:'Kibibyte', symbol:'KiB', factor:1024           },
      { id:'mib', name:'Mebibyte', symbol:'MiB', factor:1048576        },
      { id:'gib', name:'Gibibyte', symbol:'GiB', factor:1073741824     },
      { id:'tib', name:'Tebibyte', symbol:'TiB', factor:1.099512e12    },
    ]
  },

  /* ── ENERGY ──────────────────────────────────────────────── */
  {
    id: 'energy', name: 'Energy', icon: '⚡',
    color: '#eab308', gradient: ['#eab308','#f59e0b'],
    description: 'Work & heat energy',
    type: 'linear', baseUnit: 'j',
    units: [
      { id:'j',    name:'Joule',         symbol:'J',    factor:1        },
      { id:'kj',   name:'Kilojoule',     symbol:'kJ',   factor:1000     },
      { id:'mj',   name:'Megajoule',     symbol:'MJ',   factor:1e6      },
      { id:'cal',  name:'Calorie',       symbol:'cal',  factor:4.184    },
      { id:'kcal', name:'Kilocalorie',   symbol:'kcal', factor:4184     },
      { id:'wh',   name:'Watt-hour',     symbol:'Wh',   factor:3600     },
      { id:'kwh',  name:'Kilowatt-hour', symbol:'kWh',  factor:3600000  },
      { id:'mwh',  name:'Megawatt-hour', symbol:'MWh',  factor:3.6e9    },
      { id:'btu',  name:'BTU',           symbol:'BTU',  factor:1055.06  },
      { id:'ev',   name:'Electron Volt', symbol:'eV',   factor:1.602e-19},
      { id:'erg',  name:'Erg',           symbol:'erg',  factor:1e-7     },
    ]
  },

  /* ── PRESSURE ────────────────────────────────────────────── */
  {
    id: 'pressure', name: 'Pressure', icon: '🔬',
    color: '#ec4899', gradient: ['#ec4899','#f43f5e'],
    description: 'Force per unit area',
    type: 'linear', baseUnit: 'pa',
    units: [
      { id:'pa',   name:'Pascal',      symbol:'Pa',   factor:1       },
      { id:'kpa',  name:'Kilopascal',  symbol:'kPa',  factor:1000    },
      { id:'mpa',  name:'Megapascal',  symbol:'MPa',  factor:1e6     },
      { id:'bar',  name:'Bar',         symbol:'bar',  factor:100000  },
      { id:'mbar', name:'Millibar',    symbol:'mbar', factor:100     },
      { id:'psi',  name:'PSI',         symbol:'psi',  factor:6894.76 },
      { id:'atm',  name:'Atmosphere',  symbol:'atm',  factor:101325  },
      { id:'torr', name:'Torr',        symbol:'Torr', factor:133.322 },
      { id:'mmhg', name:'mmHg',        symbol:'mmHg', factor:133.322 },
      { id:'inhg', name:'inHg',        symbol:'inHg', factor:3386.39 },
    ]
  },

  /* ── ANGLE ───────────────────────────────────────────────── */
  {
    id: 'angle', name: 'Angle', icon: '📐',
    color: '#f43f5e', gradient: ['#f43f5e','#ec4899'],
    description: 'Angular measurements',
    type: 'linear', baseUnit: 'deg',
    units: [
      { id:'deg',    name:'Degree',      symbol:'°',    factor:1             },
      { id:'rad',    name:'Radian',      symbol:'rad',  factor:180/Math.PI   },
      { id:'grad',   name:'Gradian',     symbol:'grad', factor:0.9           },
      { id:'arcmin', name:'Arcminute',   symbol:"'",    factor:1/60          },
      { id:'arcsec', name:'Arcsecond',   symbol:'"',    factor:1/3600        },
      { id:'turn',   name:'Turn/Cycle',  symbol:'turn', factor:360           },
      { id:'mrad',   name:'Milliradian', symbol:'mrad', factor:180/Math.PI/1000},
    ]
  },

  /* ── CURRENCY ────────────────────────────────────────────── */
  {
    id: 'currency', name: 'Currency', icon: '💱',
    color: '#059669', gradient: ['#059669','#10b981'],
    description: 'Exchange rates',
    type: 'currency',
    units: Object.entries(CURRENCY_RATES).map(([code, d]) => ({
      id: code, name: `${d.name}`, symbol: code, flag: d.flag, code
    }))
  },

  /* ── TYPOGRAPHY ──────────────────────────────────────────── */
  {
    id: 'typography', name: 'Typography', icon: '🖋️',
    color: '#7c3aed', gradient: ['#7c3aed','#6366f1'],
    description: 'Font & text sizes',
    type: 'linear', baseUnit: 'px',
    units: [
      { id:'px',   name:'Pixel',          symbol:'px',  factor:1       },
      { id:'pt',   name:'Point',          symbol:'pt',  factor:1.33333 },
      { id:'pc',   name:'Pica',           symbol:'pc',  factor:16      },
      { id:'em',   name:'Em (base 16px)', symbol:'em',  factor:16      },
      { id:'rem',  name:'Root Em (16px)', symbol:'rem', factor:16      },
      { id:'cm_t', name:'Centimeter',     symbol:'cm',  factor:37.7953 },
      { id:'mm_t', name:'Millimeter',     symbol:'mm',  factor:3.77953 },
      { id:'in_t', name:'Inch',           symbol:'in',  factor:96      },
      { id:'vw',   name:'Viewport Width', symbol:'vw',  factor:19.2    },
      { id:'vh',   name:'Viewport Height',symbol:'vh',  factor:10.8    },
    ]
  },

  /* ── COOKING ─────────────────────────────────────────────── */
  {
    id: 'cooking', name: 'Cooking', icon: '🍳',
    color: '#f97316', gradient: ['#f97316','#ef4444'],
    description: 'Kitchen measurements',
    type: 'linear', baseUnit: 'tsp',
    units: [
      { id:'tsp_c',  name:'Teaspoon',   symbol:'tsp',    factor:1        },
      { id:'tbsp_c', name:'Tablespoon', symbol:'tbsp',   factor:3        },
      { id:'floz_c', name:'Fluid Oz',   symbol:'fl oz',  factor:6        },
      { id:'cup_c',  name:'Cup',        symbol:'cup',    factor:48       },
      { id:'pt_c',   name:'Pint',       symbol:'pt',     factor:96       },
      { id:'qt_c',   name:'Quart',      symbol:'qt',     factor:192      },
      { id:'gal_c',  name:'Gallon',     symbol:'gal',    factor:768      },
      { id:'ml_c',   name:'Milliliter', symbol:'mL',     factor:0.202884 },
      { id:'l_c',    name:'Liter',      symbol:'L',      factor:202.884  },
      { id:'dl_c',   name:'Deciliter',  symbol:'dL',     factor:20.2884  },
    ]
  },

  /* ── FUEL EFFICIENCY ─────────────────────────────────────── */
  {
    id: 'fuel', name: 'Fuel Efficiency', icon: '⛽',
    color: '#84cc16', gradient: ['#84cc16','#22c55e'],
    description: 'Fuel consumption',
    type: 'special',
    units: [
      { id:'mpg_us', name:'Miles/Gallon (US)', symbol:'mpg'     },
      { id:'mpg_uk', name:'Miles/Gallon (UK)', symbol:'mpg UK'  },
      { id:'kml',    name:'Kilometers/Liter',  symbol:'km/L'    },
      { id:'l100km', name:'Liters/100km',      symbol:'L/100km' },
      { id:'km100l', name:'km per 100 Liters', symbol:'km/100L' },
    ],
    convert(value, from, to) {
      if (value === 0) return 0;
      let mpg;
      switch(from) {
        case 'mpg_us': mpg = value; break;
        case 'mpg_uk': mpg = value * 0.832674; break;
        case 'kml':    mpg = value * 2.35215;  break;
        case 'l100km': mpg = 235.215 / value;  break;
        case 'km100l': mpg = value * 2.35215 / 100; break;
        default: return NaN;
      }
      switch(to) {
        case 'mpg_us': return mpg;
        case 'mpg_uk': return mpg / 0.832674;
        case 'kml':    return mpg / 2.35215;
        case 'l100km': return 235.215 / mpg;
        case 'km100l': return mpg / 2.35215 * 100;
        default: return NaN;
      }
    }
  },

  /* ── POWER ───────────────────────────────────────────────── */
  {
    id: 'power', name: 'Power', icon: '🔌',
    color: '#d97706', gradient: ['#d97706','#f59e0b'],
    description: 'Power & wattage',
    type: 'linear', baseUnit: 'w',
    units: [
      { id:'w',      name:'Watt',          symbol:'W',     factor:1       },
      { id:'kw',     name:'Kilowatt',      symbol:'kW',    factor:1000    },
      { id:'mw',     name:'Megawatt',      symbol:'MW',    factor:1e6     },
      { id:'gw',     name:'Gigawatt',      symbol:'GW',    factor:1e9     },
      { id:'hp',     name:'Horsepower',    symbol:'hp',    factor:745.7   },
      { id:'hp_m',   name:'Metric HP',     symbol:'PS',    factor:735.499 },
      { id:'btu_hr', name:'BTU/Hour',      symbol:'BTU/h', factor:0.29307 },
      { id:'cal_s',  name:'Calorie/Second',symbol:'cal/s', factor:4.184   },
      { id:'va',     name:'Volt-Ampere',   symbol:'VA',    factor:1       },
    ]
  },

  /* ── FREQUENCY ───────────────────────────────────────────── */
  {
    id: 'frequency', name: 'Frequency', icon: '📡',
    color: '#2563eb', gradient: ['#2563eb','#6366f1'],
    description: 'Cycles & vibrations',
    type: 'linear', baseUnit: 'hz',
    units: [
      { id:'hz',     name:'Hertz',      symbol:'Hz',    factor:1           },
      { id:'khz',    name:'Kilohertz',  symbol:'kHz',   factor:1e3         },
      { id:'mhz',    name:'Megahertz',  symbol:'MHz',   factor:1e6         },
      { id:'ghz',    name:'Gigahertz',  symbol:'GHz',   factor:1e9         },
      { id:'thz',    name:'Terahertz',  symbol:'THz',   factor:1e12        },
      { id:'rpm',    name:'RPM',        symbol:'rpm',   factor:1/60        },
      { id:'rps',    name:'Rev/Second', symbol:'rps',   factor:1           },
      { id:'rad_s',  name:'Rad/Second', symbol:'rad/s', factor:1/(2*Math.PI)},
      { id:'bpm',    name:'Beats/Min',  symbol:'bpm',   factor:1/60        },
    ]
  },

  /* ── SCIENTIFIC ──────────────────────────────────────────── */
  {
    id: 'scientific', name: 'Scientific', icon: '🔭',
    color: '#9333ea', gradient: ['#9333ea','#7c3aed'],
    description: 'Physics & lab units',
    type: 'linear', baseUnit: 'n',
    units: [
      { id:'n',      name:'Newton',        symbol:'N',    factor:1        },
      { id:'kn',     name:'Kilonewton',    symbol:'kN',   factor:1000     },
      { id:'mn_f',   name:'Meganewton',    symbol:'MN',   factor:1e6      },
      { id:'dyne',   name:'Dyne',          symbol:'dyn',  factor:1e-5     },
      { id:'lbf',    name:'Pound-force',   symbol:'lbf',  factor:4.44822  },
      { id:'kgf',    name:'Kilogram-force',symbol:'kgf',  factor:9.80665  },
      { id:'ozf',    name:'Ounce-force',   symbol:'ozf',  factor:0.278014 },
      { id:'pdl',    name:'Poundal',       symbol:'pdl',  factor:0.138255 },
    ]
  },
];

/* ── Conversion Engine ──────────────────────────────────────── */

function convertLinear(value, fromId, toId, units) {
  const from = units.find(u => u.id === fromId);
  const to   = units.find(u => u.id === toId);
  if (!from || !to) return NaN;
  return value * from.factor / to.factor;
}

function convertCurrency(value, fromCode, toCode) {
  const from = CURRENCY_RATES[fromCode];
  const to   = CURRENCY_RATES[toCode];
  if (!from || !to) return NaN;
  return (value / from.rate) * to.rate;
}

function convert(categoryId, value, fromId, toId) {
  if (fromId === toId) return value;
  if (isNaN(value)) return NaN;
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return NaN;
  if (cat.type === 'special')  return cat.convert(value, fromId, toId);
  if (cat.type === 'currency') return convertCurrency(value, fromId, toId);
  if (cat.type === 'linear')   return convertLinear(value, fromId, toId, cat.units);
  return NaN;
}

function convertAll(categoryId, value, fromId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return cat.units.map(u => ({
    unit: u,
    value: convert(categoryId, value, fromId, u.id)
  }));
}

/* ── Number formatting ──────────────────────────────────────── */

function formatNum(n, maxSig = 8) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e15 || (abs < 1e-6 && abs !== 0)) {
    return n.toExponential(4);
  }
  const str = parseFloat(n.toPrecision(maxSig)).toString();
  return str;
}

function formatForDisplay(n) {
  if (n === null || isNaN(n)) return '—';
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || (abs < 0.000001 && abs !== 0)) {
    return n.toExponential(6);
  }
  if (Number.isInteger(n) || String(n).split('.')[1]?.length <= 2) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return n.toPrecision(8).replace(/\.?0+$/, '');
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
