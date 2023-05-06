import React from 'react'
import Image from 'next/image'
import { Button, DialogActions, Grid, Divider, Dialog, DialogTitle, DialogContent, Stack, Card, ImageBG, CardContent, Checkbox } from './global'
import { getMedias, uploadImages } from '@/api/uploads'
import useAlert from '@/contexts/useAlert'
import { removeDuplicatedObjects } from '@/functions/utils'

interface Props {
    open: boolean,
    onClose: (...args: any[]) => void,
    onSelect: (...args: any[]) => void,
    previousMedias: any[],
    currentMedias: any[]
}

const MediasModal = ({ open, onClose, onSelect, previousMedias, currentMedias }: Props) => {
    const [nav, setNav] = React.useState<number>(1)

    const all = React.useMemo(() => {
        return removeDuplicatedObjects([...currentMedias, ...previousMedias], '_id')
    }, [previousMedias, currentMedias])

    const [medias, setMedias] = React.useState<any[]>([])

    React.useEffect(() => {
        const fetchMedias = async () => {
            const { medias: allMedias } = await getMedias()
            setMedias(allMedias)
        }
        fetchMedias()
    }, [])

    const MediaCard = ({ media, onClick }: any) => {
        return (
            <Card style={{ cursor: 'pointer' }} onClick={onClick}>
                <ImageBG>
                    <Checkbox
                        checked={currentMedias.some(m => m._id === media._id)}
                        onChange={() => { }}
                        style={{ position: 'absolute', top: 10, left: 10 }}
                    />
                    <Image
                        src={`${process.env.SERVER_URL}${media.path}`}
                        priority={false}
                        width={300}
                        height={300}
                        style={{ display: 'block', width: 'auto', maxWidth: '100%', height: 100, objectFit: 'contain', margin: '0 auto' }}
                        alt={media.name || 'media'}
                    />
                </ImageBG>
                <CardContent small ellipsis={1}>
                    <p>{media.name}</p>
                </CardContent>
            </Card>
        )
    }

    const { setAlert } = useAlert();

    const uploadMedias = async (medias: any) => {
        if (medias) {
            const { errors, data } = await uploadImages(medias)
            if (errors.message) {
                setAlert(errors.message, 'error')
            } else {
                setMedias(prev => ([...prev, ...data]))
                setAlert('Médias ajoutés avec succès !', 'success')
            }
        }
    }

    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            style={{ maxWidth: 830 }}
        >
            <DialogTitle>
                Détails
            </DialogTitle>
            <DialogActions style={{ backgroundColor: 'var(--bg-one)', justifyContent: 'space-between' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    divider={<Divider orientation="vertical" />}
                    spacing={1.5}
                >
                    <Button small noPadding variant="classic" selected={nav === 0} onClick={() => setNav(0)}>
                        Tous
                    </Button>
                    <Button small noPadding variant="classic" selected={nav === 1} onClick={() => setNav(1)}>
                        Sélectionnés
                    </Button>
                </Stack>
                <Button small noPadding>
                    Ajouter des médias
                    <input type='file' id='files' multiple onChange={e => uploadMedias(Array.from(e.target.files!))} />
                </Button>
            </DialogActions>
            <Divider />
            <DialogContent>
                {nav === 1 ? (
                    all.length > 0 ? (
                        <Grid xs={1} md={2} lg={3} xl={4} spacing={1}>
                            {all.map((media, i) => {
                                return (
                                    <MediaCard
                                        key={i}
                                        media={media}
                                        onClick={() => onSelect(media, i)}
                                    />
                                )
                            })}
                        </Grid>
                    ) : (
                        <p>Aucun média sélectionné.</p>
                    )
                ) : (
                    medias.length > 0 ? (
                        <Grid xs={1} md={2} lg={3} xl={4} spacing={1}>
                            {medias.map((media, i) => {
                                return (
                                    <MediaCard
                                        key={i}
                                        media={media}
                                        onClick={() => onSelect(media, all.findIndex(e => e._id === media._id))}
                                    />
                                )
                            })}
                        </Grid>
                    ) : (
                        <p>Aucun média téléchargé.</p>
                    )
                )}
            </DialogContent>
            <DialogActions>
                <Button small noPadding variant="classic" onClick={() => onClose()}>
                    Annuler
                </Button>
                <Button small noPadding onClick={() => onClose()}>
                    Terminer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MediasModal