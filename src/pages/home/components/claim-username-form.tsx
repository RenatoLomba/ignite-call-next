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

const FormAnnotation = styled('div', {
  display: 'block',
  marginTop: '$2',

  [`> ${Text}`]: {
    color: '$gray400',
  },
})

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Permitido apenas letras e hífen(-)',
    })
    .transform((val) => val.toLowerCase()),
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
    <>
      <FormContainer as="form" onSubmit={handleSubmit(onFormSubmit)}>
        <TextInput
          {...register('username')}
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
        />

        <Button size="sm" type="submit">
          Reservar
          <ArrowRight size={20} />
        </Button>
      </FormContainer>

      <FormAnnotation>
        <Text as="small" size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário'}
        </Text>
      </FormAnnotation>
    </>
  )
}
