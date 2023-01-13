import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { useMutation } from '@tanstack/react-query'

import { api } from '../../../lib/axios'
import { withSSRAuthSession } from '../../../utils/with-ssr-auth-session'
import { Container, FormAnnotation, Header, ProfileBox } from './styles'

const formSchema = z.object({
  bio: z.string(),
})

type FormFields = z.infer<typeof formSchema>

export default function UpdateProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: updateUserProfile, isLoading: isUpdating } = useMutation(
    async (data: FormFields) => (await api.patch('/users/profile', data)).data,
    {
      async onSettled(data) {
        if (!data) return
        await router.push(`/schedule/${session!.user.username}`)
      },
    },
  )

  const onFormSubmit = handleSubmit(async (data) => {
    await updateUserProfile(data)
  })

  const isLoading = isSubmitting || isUpdating

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep currentStep={4} size={4} />
        </Header>

        <ProfileBox as="form" onSubmit={onFormSubmit}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session?.user.avatar_url!}
              alt={session?.user.username}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />

            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isLoading}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps = withSSRAuthSession(async (_, session) => {
  return { props: { session } }
})
