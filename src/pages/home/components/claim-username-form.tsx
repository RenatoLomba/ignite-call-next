import { ArrowRight } from 'phosphor-react'

import { Box, Button, styled, TextInput } from '@ignite-ui/react'

const FormContainer = styled(Box, {
  marginTop: '$4',
  padding: '$4',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',

  '@media(max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
})

export function ClaimUsernameForm() {
  return (
    <FormContainer as="form">
      <TextInput size="sm" prefix="ignite.com/" placeholder="Seu usuário" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight size={20} />
      </Button>
    </FormContainer>
  )
}
