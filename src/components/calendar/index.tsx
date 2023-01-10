import { CaretLeft, CaretRight } from 'phosphor-react'

import { getWeekDays } from '../../utils'
import { Actions, Body, Container, Day, Header, Title } from './styles'

const weekDays = getWeekDays({ short: true })

export function Calendar() {
  return (
    <Container>
      <Header>
        <Title>
          Setembro <span>2022</span>
        </Title>

        <Actions>
          <button>
            <CaretLeft />
          </button>

          <button>
            <CaretRight />
          </button>
        </Actions>
      </Header>

      <Body>
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day}>{day}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Day>1</Day>
            </td>
            <td>
              <Day>2</Day>
            </td>
            <td>
              <Day>3</Day>
            </td>
          </tr>
        </tbody>
      </Body>
    </Container>
  )
}
