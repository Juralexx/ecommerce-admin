import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Layout } from "@/layouts";
import { Page, PageProps } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Button, Zone, ConfirmDialog, Divider, Grid, Stack } from '@/components/global';
import { deletePage, getPage, publish } from '@/api/pages';
import useAlert from '@/contexts/useAlert';
import { Check, Publish } from '@mui/icons-material';
import { isNotUser } from '@/functions/functions';

interface Props extends PageProps {
    page: Page.Options
}

export default function PagePage({ user, router, page }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })
    const { setAlert } = useAlert()

    return (
        <Layout user={user} router={router} title={page.title + ' - Pages'}>
            <h2>{`Page : ${page.title}`}</h2>
            <Breadcrumb />
            {isNotUser(user!?.role) && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    style={{ marginTop: 20 }}
                >
                    <Button mobileFull variant="classic" color="primary" noPadding onClick={() => publish(page, setAlert, () => router!.replace(router!.asPath))}>
                        {page.published ? <Check /> : <Publish />} {page.published ? 'Dépublier' : 'Publier'}
                    </Button>
                    <Stack
                        divider={<Divider orientation="vertical" />}
                        spacing={1}
                        justifyContent="space-between"
                        width={{ xs: '100%', sm: 'auto' }}
                    >
                        <Button mobileFull noPadding href={`/pages/${page._id}/update`}>
                            Modifier
                        </Button>
                        <Button mobileFull noPadding variant="delete" onClick={() => setRemove({ state: true, item: page })}>
                            Supprimer
                        </Button>
                    </Stack>
                </Stack>
            )}
            <Zone>
                <Grid xs={1} sm={2} spacing={2}>
                    <div>
                        <p className="label txt-sec">
                            Titre
                        </p>
                        <p className="label">
                            {page.title}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Lien
                        </p>
                        <p className="label">
                            {page.link}
                        </p>
                    </div>
                </Grid>
                <div style={{ margin: '24px 0' }}>
                    <p className="label txt-sec">
                        Contenu
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: page.content || '<em>Aucun contenu</em>' }} />
                </div>
            </Zone>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer cette page ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deletePage(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { page } = await getPage(params!.id as string)

    return {
        props: {
            user,
            page
        }
    }
}