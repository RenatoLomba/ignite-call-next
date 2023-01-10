import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    background: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
    fontFamily: 'Roboto, sans-serif',
  },

  '::-webkit-scrollbar': {
    width: '$1',
  },

  '::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 5px $colors$gray600',
    borderRadius: '$xs',
  },

  '::-webkit-scrollbar-thumb': {
    background: '$gray500',
    width: '$1',
    borderRadius: '$xs',
  },
})
