import React from 'react'
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Layout } from "@/layouts";
import { Page, PageProps } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { convertDeltaToString } from '../../components/editor/functions'
import { createPage } from '@/api/pages';
import useError from '@/functions/useError';
import { Button, Zone, Alert, Input, Grid, Stack } from '@/components/global';
import { isNotUser } from '@/functions/functions';

const Wysiwyg = dynamic(() => import('@/components/editor/Wysiwyg'),
    { ssr: false }
)

export default function AddPage({ user, router }: PageProps) {
    const [datas, setDatas] = React.useState<Page.Options>(Page.defaultProps)
    const { error, setError } = useError()

    const addPage = async (e: any) => {
        e.preventDefault()
        let config = {
            ...datas,
            content: convertDeltaToString(datas.content)
        }
        const { errors } = await createPage(config)
        if (errors.message) {
            setError(errors)
        } else {
            router!.replace('/pages')
        }
    }

    return (
        <Layout user={user} router={router} title='Ajouter une page'>
            <form
                onSubmit={addPage}
                method="post"
            >
                <Stack
                    spacing={2}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    justifyContent={{ xs: 'flex-start', sm: "space-between" }}
                >
                    <div>
                        <h2>Ajouter une page</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' noPadding mobileFull>
                        Enregistrer
                    </Button>
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
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (!isNotUser(user!?.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    return {
        props: {
            user
        }
    }
}