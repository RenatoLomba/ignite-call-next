import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { NextSeo } from 'next-seo'

import { Avatar, Heading, Text } from '@ignite-ui/react'

import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './components/form'
import { Container, Header } from './styles'

// #region GET_STATIC_PROPS
export async function getStaticProps({ params }: GetStaticPropsContext) {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    select: {
      name: true,
      avatar_url: true,
      bio: true,
      id: true,
    },
    where: { username },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        id: user.bio,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
// #endregion

// #region GET_STATIC_PATHS
export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    take: 20,
    orderBy: {
      created_at: 'desc',
    },
  })

  return {
    paths: users.map((user) => ({
      params: { username: user.username },
    })),
    fallback: 'blocking',
  }
}
// #endregion

export default function SchedulePage({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />

      <Container>
        <Header>
          <Avatar src={user.avatarUrl!} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </Header>

        <ScheduleForm />
      </Container>
    </>
  )
}
