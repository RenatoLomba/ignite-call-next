import { Box, styled, Text } from '@ignite-ui/react'

export const Container = styled(Box, {
  maxWidth: 540,
  margin: '$6 auto 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  [`> ${Text}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    svg: {
      color: '$gray200',
      width: '$5',
      height: '$5',
    },
  },

  paddingBottom: '$6',
  marginBottom: '$2',
  borderBottom: '1px solid $colors$gray600',
})

export const FormErrorText = styled(Text, {
  color: '#f75a68',
})

export const Actions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '$2',
  marginTop: '$2',
})
