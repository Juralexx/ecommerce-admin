import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Category, PageProps } from "@/types";
import { EditNote, Start, Add, Apps, ViewHeadline, Delete, Panorama } from '@mui/icons-material';
import { Layout, RootPagesLayout } from "@/layouts";
import { deleteCategory, getCategories } from "@/api/categories";
import { ToolMenu, Button, Divider, IconButton, ConfirmDialog, CardHeader, CardContent, Card, Grid, Table, TableRow, TableCell, ImageBG } from '@/components/global';
import { isNotUser } from '@/functions/functions';
import useSortableTable from '@/functions/useSortableTable';

interface Props extends PageProps {
    categories: Category.Options[]
}

export default function Categories({ user, router, categories }: Props) {
    const [display, setDisplay] = React.useState<string>('table')
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    const ActionMenu = ({ category, horizontale = false }: any) => {
        return (
            <ToolMenu horizontale={horizontale}>
                <Link href={`/categories/${category._id}`}>
                    <Start fontSize="small" /> Voir
                </Link>
                {isNotUser(user!?.role) && (
                    <React.Fragment>
                        <Link href={`/categories/${category._id}/update`}>
                            <EditNote /> Modifier
                        </Link>
                        <Divider />
                        <div onClick={() => setRemove({ state: true, item: category })}>
                            <Delete fontSize="small" /> Supprimer
                        </div>
                    </React.Fragment>
                )}
            </ToolMenu>
        )
    }

    const [datas, setDatas] = React.useState<Category.Options[]>([...categories])

    const { sortedDatas, sortTable, config } = useSortableTable({
        datas: datas,
        config: [
            '',
            { label: 'Nom', action: () => sortTable('name') },
            { label: 'Parent', action: () => sortTable('parent') },
            'URL',
            'Image',
            '',
        ]
    })

    return (
        <Layout user={user} router={router} title='Catégories'>
            <RootPagesLayout
                title='Catégories'
                addButton={
                    isNotUser(user!?.role) && (
                        <Button href='/categories/add' mobileFull>
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
                {display === 'grid' ? (
                    <Grid xs={1} sm={2} lg={3} xl={4} spacing={2}>
                        {categories.map((category: Category.Options, i: number) => {
                            return (
                                <Card key={i}>
                                    <CardHeader
                                        action={<ActionMenu category={category} />}
                                        title={category.name}
                                        subtitle={category.parent}
                                    />
                                    {category.image ? (
                                        <Image
                                            src={`${process.env.SERVER_URL}${category.image!.path}`}
                                            height={140}
                                            width={300}
                                            style={{ height: 140, width: "100%", objectFit: 'cover' }}
                                            alt={category.name}
                                            title={category.name}
                                        />
                                    ) : (
                                        <ImageBG>
                                            <Panorama />
                                            <p>Aucune image</p>
                                        </ImageBG>
                                    )}
                                    {category.content &&
                                        <CardContent ellipsis={3}>
                                            <div dangerouslySetInnerHTML={{ __html: category.content }} />
                                        </CardContent>
                                    }
                                </Card>
                            )
                        })}
                    </Grid>
                ) : (
                    <Table thead={config}>
                        {sortedDatas &&
                            sortedDatas.map((category, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {category.image &&
                                            <Image
                                                src={`${process.env.SERVER_URL}${category.image!.path}`}
                                                height={40}
                                                width={40}
                                                style={{ borderRadius: 100 }}
                                                alt={category.name}
                                                title={category.name}
                                            />
                                        }
                                    </TableCell>
                                    {[category.name, category.parent, category.link, category.image!.name]
                                        .map((el: any, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            )
                                        })}
                                    <TableCell>
                                        <ActionMenu category={category} horizontale={true} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </Table>
                )}
                <ConfirmDialog
                    title="Voulez-vous vraiment supprimer cette catégorie ?"
                    text="Cette action est irréversible."
                    confirmButton='Supprimer'
                    open={remove.state}
                    onClose={() => setRemove({ state: false, item: null })}
                    onConfirm={() => {
                        deleteCategory(remove.item)
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

    const { categories } = await getCategories()
    return {
        props: {
            user,
            categories
        }
    }
}