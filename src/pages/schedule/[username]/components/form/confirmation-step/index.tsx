import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import { Actions, Container, Header } from './styles'

const formSchema = z.object({
  name: z.string().min(3, { message: 'Mínimo de 3 caracteres' }),
  email: z.string().email({ message: 'Insira um e-mail valido' }),
  observations: z.string(),
})

type FormFields = z.infer<typeof formSchema>

export function ConfirmationStep() {
  const { handleSubmit, register } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const onFormSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <Container as="form" onSubmit={onFormSubmit}>
      <Header>
        <Text>
          <CalendarBlank /> 22 de Setembro de 2022
        </Text>

        <Text>
          <Clock /> 18:00h
        </Text>
      </Header>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput placeholder="johndoe@example.com" {...register('email')} />
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <Actions>
        <Button variant="tertiary" type="button">
          Cancelar
        </Button>

        <Button type="submit">Confirmar</Button>
      </Actions>
    </Container>
  )
}
