import { styled, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'auto',

  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 280,
})

export const Header = styled(Text, {
  fontWeight: '$medium',
  textTransform: 'capitalize',

  span: {
    color: '$gray200',
  },
})

export const TimeList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media(max-width: 900px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const TimeItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',
  transition: 'background 0.2s ease',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})
