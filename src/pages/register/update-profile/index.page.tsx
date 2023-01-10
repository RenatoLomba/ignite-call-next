import { useSession } from 'next-auth/react'
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

import { withSSRAuthSession } from '../../../utils/with-ssr-auth-session'
import { Container, FormAnnotation, Header, ProfileBox } from './styles'

const formSchema = z.object({
  bio: z.string(),
})

type FormFields = z.infer<typeof formSchema>

export default function UpdateProfilePage() {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  console.log({ session })

  const onFormSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  const isLoading = isSubmitting

  return (
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
  )
}

export const getServerSideProps = withSSRAuthSession(async (_, session) => {
  return { props: { session } }
})
