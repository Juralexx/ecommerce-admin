import React from 'react'
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Img, PageProps } from '@/types'
import { Layout, RootPagesLayout } from '@/layouts'
import { Add } from '@mui/icons-material';
import { deleteMedia, getMedias, updateMedia, uploadImages } from '@/api/uploads';
import { PictureDropzone } from '@/components/dropzones/ImageDropzone';
import useError from '@/functions/useError';
import useAlert from '@/contexts/useAlert';
import { Button, ImageBG, Card, CardContent, Alert, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Stack } from '@/components/global';
import { isNotUser } from '@/functions/functions';

interface Props extends PageProps {
    medias: Img.Options[]
}

export default function Medias({ user, router, medias }: Props) {
    const [open, setOpen] = React.useState<number>(-1)

    const { error, setError } = useError()
    const { setAlert } = useAlert();
    const [currentMedia, setCurrentMedia] = React.useState<Record<string, any>>({ image: null, original: null })

    const getMediaActionOnFinish = async () => {
        const { original, image } = currentMedia

        if (!image) {
            const { errors } = await deleteMedia(original)
            if (errors.message) {
                setAlert(errors.message, 'error')
            } else {
                setAlert('Média supprimé avec succès !', 'success')
            }
        } else if (original.path !== image.path) {
            const { errors } = await updateMedia(original._id, image, original.path)
            if (errors.message) {
                setAlert(errors.message, 'error')
            } else {
                setAlert('Média modifié avec succès !', 'success')
            }
        }
        setOpen(-1);
        router!.replace('/medias')
    }

    const uploadMedias = async (medias: any) => {
        if (medias) {
            const { errors } = await uploadImages(medias)
            if (errors.message) {
                setAlert(errors.message, 'error')
            } else {
                setAlert('Médias ajoutés avec succès !', 'success')
            }
            const timeout = setTimeout(() => { return router!.replace('/medias') }, 500)
            return () => clearTimeout(timeout)
        }
    }

    return (
        <Layout user={user} router={router} title='Médias'>
            <RootPagesLayout
                title='Médias'
                addButton={
                    isNotUser(user!?.role) && (
                        <Button>
                            <Add /> Ajouter
                            <input type='file' id='files' multiple onChange={e => uploadMedias(Array.from(e.target.files!))} />
                        </Button>
                    )
                }
            >
                <Grid xs={1} sm={2} lg={3} xl={4} spacing={2}>
                    {medias.map((media: Img.Options, i: number) => {
                        return (
                            <div key={i}>
                                <Card
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setCurrentMedia({ image: media, original: media })
                                        setOpen(i)
                                    }}
                                >
                                    <ImageBG>
                                        <Image
                                            src={`${process.env.SERVER_URL}${media.path}`}
                                            priority={false}
                                            width={300}
                                            height={300}
                                            style={{ display: 'block', width: 'auto', height: 150, objectFit: 'contain', margin: '0 auto' }}
                                            alt={media.name || 'media'}
                                        />
                                    </ImageBG>
                                    <CardContent ellipsis={1}>
                                        <p>{media.name}</p>
                                    </CardContent>
                                </Card>
                                {isNotUser(user!?.role) && (
                                    <Dialog
                                        onClose={() => setOpen(-1)}
                                        open={open === i}
                                    >
                                        <DialogTitle>
                                            Détails
                                        </DialogTitle>
                                        <Divider />
                                        <DialogContent dividers>
                                            <Grid xs={1} md={2} spacing={2}>
                                                <div>
                                                    <PictureDropzone
                                                        datas={currentMedia}
                                                        setDatas={setCurrentMedia}
                                                        error={error}
                                                        setError={setError}
                                                    />
                                                    {(error.error === 'maxSize' || error.error === 'format' || error.error === 'file') &&
                                                        <Alert type="error">{error.message}</Alert>
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                                            Nom
                                                        </p>
                                                        <p>{media.name}</p>
                                                    </div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                                            Taille
                                                        </p>
                                                        <p>{media.size}</p>
                                                    </div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                                                            Extension
                                                        </p>
                                                        <p>{media.extension}</p>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </DialogContent>
                                        <Divider />
                                        <DialogActions>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                spacing={1}
                                                style={{ width: "100%" }}
                                            >
                                                <Button small noPadding variant="classic">
                                                    Remplacer
                                                </Button>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    <Button small noPadding variant="classic" onClick={() => setOpen(-1)}>
                                                        Annuler
                                                    </Button>
                                                    <Button small noPadding onClick={() => getMediaActionOnFinish()}>
                                                        Terminer
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </DialogActions>
                                    </Dialog>
                                )}
                            </div>
                        )
                    })}
                </Grid>
            </RootPagesLayout>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    const { medias } = await getMedias()
    return {
        props: {
            user,
            medias
        }
    }
}