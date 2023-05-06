import React from 'react'
import { isAuthenticated } from '@/api/session'
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Layout } from "@/layouts";
import { Category, PageProps } from "@/types";
import { deleteCategory, getCategory } from '@/api/categories';
import { Button, ImageBG, Zone, ConfirmDialog, Divider, Grid, Stack, Breadcrumb } from '@/components/global';
import { Filter } from '@mui/icons-material';
import { isNotUser } from '@/functions/functions';

interface Props extends PageProps {
    category: Category.Entity
}

export default function CategoryPage({ user, router, category }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    return (
        <Layout user={user} router={router} title={category.name + ' - Catégories'}>
            <h2>{`Catégorie : ${category.name}`}</h2>
            <Breadcrumb />
            {isNotUser(user!?.role) && (
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" />}
                    spacing={2}
                    style={{ marginTop: 20, marginLeft: 'auto', justifyContent: 'flex-end' }}
                >
                    <Button mobileFull noPadding href={`/categories/${category._id}/update`}>
                        Modifier
                    </Button>
                    <Button mobileFull noPadding variant="delete" onClick={() => setRemove({ state: true, item: category })}>
                        Supprimer
                    </Button>
                </Stack>
            )}
            <Zone>
                <p className="label txt-sec">
                    Nom
                </p>
                <p className="label">
                    {category.name}
                </p>
                <div style={{ margin: '24px 0' }}>
                    <p className="label txt-sec">
                        Description
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: category.content || '<em>Aucune description</em>' }} />
                </div>
                <div style={{ margin: '24px 0' }}>
                    <p className="label txt-sec">
                        Image
                    </p>
                    <ImageBG>
                        {category.image?.path ? (
                            <Image
                                src={`${process.env.SERVER_URL}${category.image!.path}`}
                                height={140}
                                width={300}
                                style={{ display: 'block', height: '100%', width: "auto", maxWidth: '100%', margin: '0 auto' }}
                                alt={category.name}
                                title={category.name}
                            />
                        ) : (
                            <React.Fragment>
                                <Filter />
                                <p>Aucune image</p>
                            </React.Fragment>
                        )}
                    </ImageBG>
                </div>
                <Grid xs={1} sm={2} spacing={2}>
                    <div>
                        <p className="label txt-sec">
                            Lien
                        </p>
                        <p className="label">
                            {category.link}
                        </p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Parent
                        </p>
                        <p className="label">
                            {category.parent}
                        </p>
                    </div>
                </Grid>
            </Zone>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer cette catégorie ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deleteCategory(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { category } = await getCategory(params!.id as string)

    return {
        props: {
            user,
            category
        }
    }
}