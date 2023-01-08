import { ArrowRight } from 'phosphor-react'

import {
  Heading,
  Text,
  MultiStep,
  Button,
  Checkbox,
  TextInput,
} from '@ignite-ui/react'

import {
  Container,
  Header,
  IntervalBox,
  IntervalDate,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'

export default function TimeIntervalsPage() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep currentStep={3} size={4} />
      </Header>

      <IntervalBox as="form">
        <IntervalsContainer>
          <IntervalItem>
            <IntervalDate>
              <Checkbox />
              <Text>Segunda-feira</Text>
            </IntervalDate>
            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>

          <IntervalItem>
            <IntervalDate>
              <Checkbox />
              <Text>Terça-feira</Text>
            </IntervalDate>
            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>
        </IntervalsContainer>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
