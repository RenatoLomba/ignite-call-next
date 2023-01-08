import { ArrowRight } from 'phosphor-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Heading,
  Text,
  MultiStep,
  Button,
  Checkbox,
  TextInput,
} from '@ignite-ui/react'

import { getWeekDays } from '../../../utils/get-week-days'
import {
  Container,
  Header,
  IntervalBox,
  IntervalDate,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'

const formSchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
})

type FormFields = z.infer<typeof formSchema>

const weekDays = getWeekDays()

export default function TimeIntervalsPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const { fields } = useFieldArray({
    name: 'intervals',
    control,
  })

  const onFormSubmit = handleSubmit(async (data) => {
    console.log({ data })
  })

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

      <IntervalBox as="form" onSubmit={onFormSubmit}>
        <IntervalsContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDate>
                <Checkbox checked={field.enabled} />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDate>
              <IntervalInputs>
                <TextInput
                  {...register(`intervals.${index}.startTime`)}
                  size="sm"
                  type="time"
                  step={60}
                />
                <TextInput
                  {...register(`intervals.${index}.endTime`)}
                  size="sm"
                  type="time"
                  step={60}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
