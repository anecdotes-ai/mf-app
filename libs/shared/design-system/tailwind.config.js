var colors = {
  'transparent': 'rgb(0, 0, 0, 0)',
  'blue-0': '#ebfdfe',
  'blue-10': '#dafdff',
  'blue-30': '#99f8fd',
  'blue-50': '#00DCE8',
  'blue-60': '#30cad9',
  'blue-70': '#009fb5',
  'blue-90': '#008193',
  'blue-90-05': '#F3F8F9',
  'blue-90-10': '#E8F2F4',
  'blue-90-15': '#D9ECEF',
  'orange-0': '#fef8f1',
  'orange-10': '#fff2e4',
  'orange-30': '#ffd8af',
  'orange-50': '#ffa84f',
  'orange-60': '#ff9126',
  'orange-70': '#e67400',
  'orange-80': '#cc6700',
  'orange-90': '#b55b00',
  'pink-0': '#fceff7',
  'pink-10': '#ffdfef',
  'pink-50': '#ff3499',
  'pink-60': '#f9007b',
  'pink-70': '#e00070',
  'pink-80': '#c80061',
  'pink-90': '#ae0057',
  'navy-10': '#f8f9f9',
  'navy-20': '#f5f6f7',
  'navy-30': '#edf0f1',
  'navy-40': '#d6dcdf',
  'navy-50': '#bfc8ce',
  'navy-60': '#a4b5bf',
  'navy-70': '#81939e',
  'navy-80': '#2a495b',
  'navy-90': '#04293e',
  'white': '#ffffff',
  'error': '#e00070'
};

module.exports = {
  important: true,
  purge: {
    enabled: false, // TODO: TEMPORARY DISABLED SINCE CSS GETS PURGED FOR STORYBOOK
    content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}']
  },
  theme: {
    colors: colors,
    backgroundColor: theme => ({
      ...theme('colors')
     }),
    textColors: theme => ({
      ...theme('colors')
     }),
    borderColor: theme => ({
      ...theme('colors')
     }),
    fill: (theme) => ({
      ...theme('colors'),
    }),
    stroke: (theme) => ({
      ...theme('colors'),
    }),
    fontFamily: {
      'main': 'Mulish',
      'secondary': 'Merriweather'
    },
    fontSize: {
      'xs': ['10px', '150%'], // Format: '{{name}}': '{{size}}' | ['{{size}}', '{{line-height}}']
      'sm': ['11px', '150%'],
      'lg': ['12px', '150%'],
      'base': ['13px', '150%'],
      'xl': ['14px', '150%'],
      '2xl': ['16px', '150%'],
      '3xl': ['18px', '150%'],
      '4xl': ['21px', '150%'],
      '5xl': ['24px', '150%'],
      '6xl': ['32px', '150%'],
    },
    minWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
     },
    extend: {
      spacing: {
        '15': '3.75rem', // 60px
        '25': '6.25rem', // 100px
        '27': '6.75rem', // 108px
        '75': '18.75rem', // 300px
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
      minWidth: theme => ({
        ...theme('spacing'),
        full: '100%'
      }),
      maxWidth: theme => ({
        ...theme('spacing'),
        full: '100%'
      }),
      minHeight: theme => ({
        ...theme('spacing'),
        full: '100%'
      }),
      maxHeight: theme => ({
        ...theme('spacing'),
        full: '100%'
      }),
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
      pointerEvents: ['hover', 'focus'],
    }
  },
  plugins: [],
};
