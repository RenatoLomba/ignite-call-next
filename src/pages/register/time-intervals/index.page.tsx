// #region IMPORTS
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
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
import { useMutation } from '@tanstack/react-query'

import { api } from '../../../lib/axios'
import { convertTimeStringToMinutes, getWeekDays } from '../../../utils'
import {
  Container,
  FormErrorText,
  Header,
  IntervalBox,
  IntervalDate,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
// #endregion

const formSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string().transform(convertTimeStringToMinutes),
        endTime: z.string().transform(convertTimeStringToMinutes),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Inclua pelo menos 1 dia da semana.',
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) => interval.endTime - 60 >= interval.startTime,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1 hora depois do horário de inicio.',
      },
    ),
})

type FormFieldsInput = z.input<typeof formSchema>
type FormFieldsOutput = z.output<typeof formSchema>

const weekDays = getWeekDays()

export default function TimeIntervalsPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<FormFieldsInput>({
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

  const { mutateAsync: createTimeIntervals, isLoading: isCreating } =
    useMutation(
      async (intervals: FormFieldsOutput['intervals']) =>
        (await api.post('/users/time-intervals', intervals)).data,
      {
        onSettled(data) {
          if (!data) return
          console.log(data)
        },
      },
    )

  const onFormSubmit = handleSubmit(async (data) => {
    const { intervals } = data as unknown as FormFieldsOutput
    await createTimeIntervals(intervals)
  })

  const intervals = watch('intervals')

  const isLoading = isSubmitting || isCreating

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
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      checked={field.value}
                    />
                  )}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDate>
              <IntervalInputs>
                <TextInput
                  {...register(`intervals.${index}.startTime`)}
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                />
                <TextInput
                  {...register(`intervals.${index}.endTime`)}
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        {errors?.intervals ? (
          <FormErrorText size="sm">{errors.intervals.message}</FormErrorText>
        ) : null}

        <Button type="submit" disabled={isLoading}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
