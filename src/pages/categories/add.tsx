import React from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Layout } from "@/layouts";
import { Category, PageProps } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { convertDeltaToString } from '../../components/editor/functions'
import { createCategory } from '@/api/categories';
import useError from '@/functions/useError';
import { Button, Zone, Alert, Input, Grid, Stack, ImageBG, IconButton } from '@/components/global';
import MediasModal from '@/components/MediasModal';
import FakeDropzone from '@/components/dropzones/FakeDropzone';
import { CloudUpload, Delete } from '@mui/icons-material';
import { isNotUser } from '@/functions/functions';

const Wysiwyg = dynamic(() => import('@/components/editor/Wysiwyg'),
    { ssr: false }
)

export default function AddCategory({ user, router }: PageProps) {
    const [datas, setDatas] = React.useState<Category.Options>(Category.defaultProps)
    const { error, setError } = useError()

    const addCategory = async (e: any) => {
        e.preventDefault()
        let config = {
            ...datas,
            image: datas.image!._id,
            content: convertDeltaToString(datas.content)
        }
        const { errors: categoryErrors } = await createCategory(config)
        if (categoryErrors.message) {
            setError(categoryErrors)
        } else {
            router!.replace('/categories')
        }
    }

    const [openMedias, setOpenMedias] = React.useState<boolean>(false)

    return (
        <Layout user={user} router={router} title='Ajouter une catégorie'>
            <form
                onSubmit={addCategory}
                encType="multipart/form-data"
                method="post"
            >
                <Stack
                    spacing={2}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    justifyContent={{ xs: 'flex-start', sm: "space-between" }}
                >
                    <div>
                        <h2>Ajouter une catégorie</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
                </Stack>
                <Zone>
                    <Input
                        name="Nom"
                        placeholder='Nom'
                        value={datas.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, name: e.target.value }))}
                        isError={error.error === 'name'}
                    />
                    {error.error === 'name' &&
                        <Alert type="error">{error.message}</Alert>
                    }
                    <div style={{ margin: '24px 0' }}>
                        <p className="label">
                            Description
                        </p>
                        <Wysiwyg
                            value={datas.content}
                            onChange={editor => setDatas(data => ({ ...data, content: editor }))}
                        />
                        {error.error === 'content' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                    <Grid xs={1} sm={2} spacing={2}>
                        <div>
                            <Input
                                name="Lien"
                                placeholder='Lien'
                                value={datas.link}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, link: e.target.value }))}
                                isError={error.error === 'link'}
                            />
                            {error.error === 'link' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                        <div>
                            <Input
                                name="Catégorie parente"
                                placeholder='Catégorie parente'
                                value={datas.parent}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, parent: e.target.value }))}
                                isError={error.error === 'parent'}
                            />
                            {error.error === 'parent' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                    <div style={{ margin: '24px 0' }}>
                        <h4>Image</h4>
                        {datas.image ? (
                            <ImageBG>
                                <Image
                                    src={`${process.env.SERVER_URL}${datas.image!.path}`}
                                    height={140}
                                    width={300}
                                    style={{ display: 'block', height: '100%', width: "auto", maxWidth: '100%', margin: '0 auto' }}
                                    alt={datas.name}
                                    title={datas.name}
                                />
                                <Stack
                                    spacing={1}
                                    style={{ position: 'absolute', top: 10, right: 10 }}
                                >
                                    <IconButton small onClick={() => setOpenMedias(!openMedias)}>
                                        <CloudUpload />
                                    </IconButton>
                                    <IconButton small onClick={() => setDatas((data: any) => ({ ...data, image: null }))}>
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            </ImageBG>
                        ) : (
                            <FakeDropzone
                                onClick={() => setOpenMedias(!openMedias)}
                            />
                        )}
                    </div>
                </Zone>
            </form>
            <MediasModal
                open={openMedias}
                onClose={() => setOpenMedias(!openMedias)}
                previousMedias={datas.image ? [datas.image] : []}
                currentMedias={datas.image ? [datas.image] : []}
                onSelect={(media, key) => setDatas(data => ({ ...data, image: data.image?._id === media._id ? null : media }))}
            />
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