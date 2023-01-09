import type { GetServerSideProps } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { ArrowRight, Check } from 'phosphor-react'

import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'

import {
  AuthErrorText,
  ConnectBox,
  ConnectItem,
  Container,
  Header,
} from './styles'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })

  if (!session) {
    const { '@ignite-call:userId': userId } = parseCookies(ctx)

    if (!userId) {
      return {
        redirect: {
          destination: '/register',
          permanent: false,
        },
      }
    }
  }

  return {
    props: { session },
  }
}

export default function CalendarConnectionPage() {
  const router = useRouter()
  const { status } = useSession()
  const { permissions_error: permissionsError } = router.query

  const isAuthenticated = status === 'authenticated'

  const hasAuthCalendarError =
    !isAuthenticated && !!permissionsError && permissionsError === 'calendar'

  const handleCalendarConnection = () => signIn('google')

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

          {isAuthenticated ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              onClick={handleCalendarConnection}
              size="sm"
              variant="secondary"
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthCalendarError ? (
          <AuthErrorText size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthErrorText>
        ) : null}

        <Button disabled={!isAuthenticated}>
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
