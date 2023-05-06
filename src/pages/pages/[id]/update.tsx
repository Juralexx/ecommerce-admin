import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import dynamic from 'next/dynamic';
import { Layout } from "@/layouts";
import { Page, PageProps } from "@/types";
import { Button, Input, Zone, Alert, Grid, Stack } from '@/components/global';
import Breadcrumb from "@/components/global/Breadcrumb";
import { convertDeltaToString } from '../../../components/editor/functions'
import useError from '@/functions/useError';
import { getPage, publish, updatePage } from '@/api/pages';
import useAlert from '@/contexts/useAlert';
import { Check, Publish } from '@mui/icons-material';
import { isNotUser } from '@/functions/functions';

const Wysiwyg = dynamic(() => import('@/components/editor/Wysiwyg'),
    { ssr: false }
)

interface Props extends PageProps {
    page: Page.Options
}

export default function UpdatePage({ user, router, page }: Props) {
    const [datas, setDatas] = React.useState({ ...page })
    const { error, setError } = useError()
    const { setAlert } = useAlert()

    const update = async (e: any) => {
        e.preventDefault()
        let config: Page.Options = {
            ...datas,
            content: convertDeltaToString(datas.content)
        }
        const { errors } = await updatePage(page, config)
        if (errors.message) {
            setError(errors)
        } else {
            router!.replace(`/pages/${page._id}`)
        }
    }

    return (
        <Layout user={user} router={router} title={'Modifier : ' + page.title}>
            <form
                onSubmit={update}
                method="put"
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    justifyContent={{ xs: 'flex-start', md: "space-between" }}
                >
                    <div style={{ width: '100%' }}>
                        <h2>Modifier : {page.title}</h2>
                        <Breadcrumb />
                    </div>
                    <Stack
                        direction='row'
                        spacing={1}
                        justifyContent={{ xs: 'center', md: "space-between" }}
                        width={{ xs: '100%', md: 'auto' }}
                    >
                        <Button tabletFull type="button" variant="classic" color="primary" noPadding onClick={() => publish(page, setAlert, () => router!.replace(router!.asPath))}>
                            {page.published ? <Check /> : <Publish />}{page.published ? 'Dépublier' : 'Publier'}
                        </Button>
                        <Button type='submit' tabletFull>
                            Enregistrer
                        </Button>
                    </Stack>
                </Stack>
                <Zone>
                    <Grid xs={1} sm={2} spacing={2}>
                        <div>
                            <Input
                                name="Titre"
                                placeholder='Titre'
                                value={datas.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, title: e.target.value }))}
                                isError={error.error === 'title'}
                            />
                            {error.error === 'title' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                        <div>
                            <Input
                                name="Lien"
                                placeholder='/lien-de-la-page'
                                value={datas.link}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, link: e.target.value }))}
                                isError={error.error === 'link'}
                            />
                            {error.error === 'link' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                    <div style={{ margin: '24px 0' }}>
                        <p className="label">
                            Description
                        </p>
                        <Wysiwyg
                            value={datas.content}
                            onChange={editor => setDatas(data => ({ ...data, content: editor }))}
                            minHeight='500px'
                            maxHeight='unset'
                        />
                        {error.error === 'content' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                </Zone>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    if (!isNotUser(user!?.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { page } = await getPage(params!.id as string)

    return {
        props: {
            user,
            page
        }
    }
}