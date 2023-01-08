import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'

import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'

import { ConnectBox, ConnectItem, Container, Header } from './styles'

export default function CalendarConnectionPage() {
  const router = useRouter()
  const { permissions_error: permissionsError } = router.query

  console.log({ permissionsError })

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep currentStep={2} size={4} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>

          <Button
            onClick={() => signIn('google')}
            size="sm"
            variant="secondary"
          >
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>

        <Button>
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
