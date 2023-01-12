import dayjs from 'dayjs'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import { Actions, Container, FormErrorText, Header } from './styles'

const formSchema = z.object({
  name: z.string().min(3, { message: 'Mínimo de 3 caracteres' }),
  email: z.string().email({ message: 'Insira um e-mail válido' }),
  observations: z.string().optional(),
})

type FormFields = z.infer<typeof formSchema>

interface ConfirmationStepProps {
  schedulingDate: Date
  onCancel: () => void
}

export function ConfirmationStep({
  schedulingDate,
  onCancel,
}: ConfirmationStepProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const onFormSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  const isLoading = isSubmitting

  const dateTime = dayjs(schedulingDate)
  const dateFormatted = dateTime.format('DD [de] MMMM [de] YYYY')
  const timeFormatted = dateTime.format('HH:mm[h]')

  return (
    <Container as="form" onSubmit={onFormSubmit}>
      <Header>
        <Text>
          <CalendarBlank /> {dateFormatted}
        </Text>

        <Text>
          <Clock /> {timeFormatted}
        </Text>
      </Header>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />

        {errors.name && (
          <FormErrorText size="sm">{errors.name.message}</FormErrorText>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput placeholder="johndoe@example.com" {...register('email')} />

        {errors.email && (
          <FormErrorText size="sm">{errors.email.message}</FormErrorText>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <Actions>
        <Button onClick={onCancel} variant="tertiary" type="button">
          Cancelar
        </Button>

        <Button disabled={isLoading} type="submit">
          Confirmar
        </Button>
      </Actions>
    </Container>
  )
}
