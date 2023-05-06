import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { PageProps } from '@/types'
import Layout from '@/layouts/Layout'

export default function Home({ user, router }: PageProps) {
    return (
        <Layout
            user={user}
            router={router}
            title='Accueil'
        >
            
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    return {
        props: {
            user
        }
    }
}

// redirect: {
//     destination: '/orders',
//     permanent: false,
// },