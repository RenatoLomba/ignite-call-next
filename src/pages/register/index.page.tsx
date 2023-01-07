import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { useMutation } from '@tanstack/react-query'

import { api } from '../../lib/axios'
import { Container, Form, FormErrorText, Header } from './styles'

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Permitido apenas letras e hífen(-)',
    })
    .transform((val) => val.toLowerCase()),
  name: z.string().min(3, { message: 'Mínimo de 3 caracteres' }),
})

type FormFields = z.infer<typeof formSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { username } = router.query

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (username && typeof username === 'string') setValue('username', username)
  }, [username, setValue])

  const { mutateAsync: createUser, isLoading } = useMutation(
    async (data: FormFields) => (await api.post('/users', data)).data,
  )

  const onFormSubmit = handleSubmit(async (data) => {
    await createUser(data)
  })

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep currentStep={1} size={4} />
      </Header>

      <Form as="form" onSubmit={onFormSubmit}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            {...register('username')}
            prefix="ignite.com/"
            placeholder="seu-usuario"
          />

          {errors.username ? (
            <FormErrorText as="small" size="sm">
              {errors.username.message}
            </FormErrorText>
          ) : null}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput {...register('name')} placeholder="Seu nome" />

          {errors.name ? (
            <FormErrorText as="small" size="sm">
              {errors.name.message}
            </FormErrorText>
          ) : null}
        </label>

        <Button disabled={isLoading} type="submit">
          Próximo passo <ArrowRight size={20} />
        </Button>
      </Form>
    </Container>
  )
}
