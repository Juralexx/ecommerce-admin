import React from 'react'
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import dynamic from 'next/dynamic';
import { Layout } from "@/layouts";
import { Category, PageProps } from "@/types";
import { Button, Input, Zone, Alert, Grid, ImageBG, Stack, IconButton } from '@/components/global';
import Breadcrumb from "@/components/global/Breadcrumb";
import MediasModal from '@/components/MediasModal';
import FakeDropzone from '@/components/dropzones/FakeDropzone';
import { CloudUpload, Delete } from '@mui/icons-material';
import { convertDeltaToString } from '../../../components/editor/functions'
import { getCategory, updateCategory } from '@/api/categories';
import useError from '@/functions/useError';
import { isNotUser } from '@/functions/functions';

const Wysiwyg = dynamic(() => import('@/components/editor/Wysiwyg'),
    { ssr: false }
)

interface Props extends PageProps {
    category: Category.Entity
}

export default function UpdateCategory({ user, router, category }: Props) {
    const [datas, setDatas] = React.useState({ ...category })
    const { error, setError } = useError()

    const update = async (e: any) => {
        e.preventDefault()
        let config: Category.Options = {
            name: datas.name,
            content: convertDeltaToString(datas.content),
            link: datas.link,
            parent: datas.parent,
            image: datas.image!._id
        }
        const { errors } = await updateCategory(category, config)
        if (errors.message) {
            setError(errors)
        } else {
            router!.replace(`/categories/${category._id}`)
        }
    }

    const [openMedias, setOpenMedias] = React.useState<boolean>(false)

    return (
        <Layout user={user} router={router} title={'Modifier : ' + category.name}>
            <form
                onSubmit={update}
                encType="multipart/form-data"
                method="put"
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                >
                    <div>
                        <h2>Modifier : {category.name}</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
                </Stack>
                <Zone>
                    <h4>Informations</h4>
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
                </Zone>
                <Zone>
                    <h4>Image</h4>
                    {datas.image ? (
                        <ImageBG>
                            <Image
                                src={`${process.env.SERVER_URL}${datas.image!.path}`}
                                height={140}
                                width={300}
                                style={{ display: 'block', height: '100%', width: "auto", maxWidth: '100%', margin: '0 auto' }}
                                alt={category.name}
                                title={category.name}
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
                    {(error.error === 'maxSize' || error.error === 'format') &&
                        <Alert type="error">{error.message}</Alert>
                    }
                </Zone>
            </form>
            <MediasModal
                open={openMedias}
                onClose={() => setOpenMedias(!openMedias)}
                previousMedias={category.image ? [category.image] : []}
                currentMedias={datas.image ? [datas.image] : []}
                onSelect={(media, key) => setDatas(data => ({ ...data, image: data.image?._id === media._id ? null : media }))}
            />
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

    const { category } = await getCategory(params!.id as string)

    return {
        props: {
            user,
            category
        }
    }
}