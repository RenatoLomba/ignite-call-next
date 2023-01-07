import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('main', {
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
  marginLeft: 'auto',
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  height: '100vh',

  '@media(max-width: 600px)': {
    justifyContent: 'center',
    maxWidth: '100vw',
  },
})

export const HeroWrapper = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
  },

  '@media(max-width: 600px)': {
    padding: '0 $5',

    [`${Heading}`]: {
      fontSize: '$6xl',
    },

    [`${Text}`]: {
      fontSize: '$lg',
    },
  },
})

export const PreviewWrapper = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})
