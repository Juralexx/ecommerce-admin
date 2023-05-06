import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Page, PageProps } from "@/types";
import { EditNote, Start, Add, Apps, ViewHeadline, Delete } from '@mui/icons-material';
import { Layout, RootPagesLayout } from "@/layouts";
import { ToolMenu, Button, Divider, IconButton, ConfirmDialog, Table, TableRow, TableCell, Zone, Tag } from '@/components/global';
import { deletePage, getPages } from '@/api/pages';
import { checkIfIsHTML } from '@/functions/utils';
import { isNotUser } from '@/functions/functions';

interface Props extends PageProps {
    pages: Page.Options[]
}

export default function Pages({ user, router, pages }: Props) {
    const [display, setDisplay] = React.useState<string>('grid')
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    return (
        <Layout user={user} router={router} title='Pages'>
            <RootPagesLayout
                title='Pages'
                addButton={
                    isNotUser(user!?.role) && (
                        <Button href='/pages/add' mobileFull>
                            <Add /> Ajouter
                        </Button>
                    )
                }
                toolsRight={
                    <IconButton noBg onClick={() => setDisplay(display === 'grid' ? 'table' : 'grid')}>
                        {display === 'grid' ? <Apps /> : <ViewHeadline />}
                    </IconButton>
                }
            >
                {pages.length > 0 ? (
                    <Table thead={['', 'Titre', 'Contenu', 'URL', 'Status', '']}>
                        {pages.map((page, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    {i + 1}
                                </TableCell>
                                {[page.title, page.content, page.link]
                                    .map((el: any, j) => {
                                        return (
                                            <TableCell key={j}>
                                                {checkIfIsHTML(el) ? (
                                                    <div
                                                        className="editor-content"
                                                        style={{ whiteSpace: 'normal' }}
                                                        dangerouslySetInnerHTML={{ __html: el }}
                                                    />
                                                ) : (
                                                    el
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                <TableCell>
                                    <Tag
                                        name={page.published ? 'Publiée' : 'Dépubliée'}
                                        color={page.published ? 'success-color' : 'danger-color'}
                                        beforeColor={page.published ? 'success-color' : 'danger-color'}
                                        rounded="md"
                                    />
                                </TableCell>
                                <TableCell>
                                    <ToolMenu>
                                        <Link href={`/pages/${page._id}`}>
                                            <Start fontSize="small" /> Voir
                                        </Link>
                                        {isNotUser(user!?.role) && (
                                            <React.Fragment>
                                                <Link href={`/pages/${page._id}/update`}>
                                                    <EditNote /> Modifier
                                                </Link>
                                                <Divider />
                                                <div onClick={() => setRemove({ state: true, item: page })}>
                                                    <Delete fontSize="small" /> Supprimer
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </ToolMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                ) : (
                    <Zone style={{ textAlign: 'center' }}>
                        Aucune page
                    </Zone>
                )}
                <ConfirmDialog
                    title="Voulez-vous vraiment supprimer cette catégorie ?"
                    text="Cette action est irréversible."
                    confirmButton='Supprimer'
                    open={remove.state}
                    onClose={() => setRemove({ state: false, item: null })}
                    onConfirm={() => {
                        deletePage(remove.item)
                        router!.replace(router!.asPath)
                    }}
                />
            </RootPagesLayout>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    const { pages } = await getPages()

    return {
        props: {
            user,
            pages
        }
    }
}