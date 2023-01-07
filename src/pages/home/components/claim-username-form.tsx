import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, styled, Text, TextInput } from '@ignite-ui/react'

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

const ErrorText = styled(Text, {
  display: 'block',
  color: '#e53e3e',
  marginTop: '$1',
})

const formSchema = z.object({
  username: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .min(1, { message: 'Mínimo de 1 caractere' }),
})

type FormFields = z.infer<typeof formSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const onFormSubmit = async (data: FormFields) => {
    console.log({ data })
  }

  return (
    <FormContainer as="form" onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <TextInput
          {...register('username')}
          size="sm"
          prefix="ignite.com/"
          placeholder="Seu usuário"
        />

        {errors.username ? (
          <ErrorText as="small" size="sm">
            {errors.username.message}
          </ErrorText>
        ) : null}
      </div>

      <Button size="sm" type="submit">
        Reservar
        <ArrowRight size={20} />
      </Button>
    </FormContainer>
  )
}
