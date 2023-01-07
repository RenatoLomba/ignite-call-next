import Image from 'next/image'

import { Heading, Text } from '@ignite-ui/react'

import { ClaimUsernameForm } from './components/claim-username-form'
import { Container, HeroWrapper, PreviewWrapper } from './styles'

export default function HomePage() {
  return (
    <Container>
      <HeroWrapper>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </HeroWrapper>

      <PreviewWrapper>
        <Image
          src="/img/app-preview.png"
          alt="Preview"
          width={827}
          height={442}
          quality={100}
          priority
        />
      </PreviewWrapper>
    </Container>
  )
}
