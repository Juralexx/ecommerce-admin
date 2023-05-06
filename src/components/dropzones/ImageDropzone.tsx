import React from 'react'
import Image from 'next/image';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Delete, CloudUpload } from '@mui/icons-material';
import { IconButton } from '../global';

interface Props {
    datas: any,
    setDatas: React.Dispatch<React.SetStateAction<any>>,
    error: any,
    setError: React.Dispatch<React.SetStateAction<any>>
}

const getDropzoneImg = (image: any) => {
    if (image && image?.path?.includes('/')) {
        return `${process.env.SERVER_URL}${image.path}`
    } else {
        return URL.createObjectURL(image)
    }
}

export const PictureDropzone = ({ datas, setDatas, error, setError }: Props) => {

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        maxFiles: 1,
        maxSize: 2000000,
        onDropAccepted: (file) => {
            if (error.error) {
                setError({ error: '', message: '' })
            }
            setDatas((data: any) => ({ ...data, image: file[0] }))
        },
        onDropRejected: (filesRejected) => {
            if (filesRejected.length > 0) {
                let err: string[] = []

                filesRejected.map(file => {
                    if (file.errors) {
                        for (let i = 0; i < file.errors.length; i++) {
                            if (file.errors[i].code === 'too-many-files') {
                                setError({ error: 'maxSize', message: 'Un seul fichier accepté.' })
                            } else {
                                if (file.errors[i].code === 'file-too-large') {
                                    err = [...err, `Le fichier ${file.file.name} à été refusé pour la raison suivante : Fichier trop lourd.`]
                                }
                                if (file.errors[i].code === 'file-invalid-type') {
                                    err = [...err, `Le fichier ${file.file.name} à été refusé pour la raison suivante : Format invalide.`]
                                }
                            }
                            if (i === file.errors.length - 1) {
                                setError({ error: 'file', message: err.join('\n') })
                            }
                        }
                    }
                })
            }
        },
        onError: () => setError({ error: 'file', message: 'Une erreur est survenue.' })
    })

    return (
        <DropzoneContainer>
            {(!datas.image || !datas.image.path) ? (
                <Dropzone {...getRootProps({ className: `${isDragActive && "active"}` })}>
                    <input {...getInputProps()} name="file" />
                    <div className='svg-container'>
                        <CloudUpload />
                    </div>
                    <div className='dropzone-text'>
                        Déposez une image ici ou sélectionnez un fichier.<br />
                        <span>Format acceptés : JPG, PNG, inférieurs à 2 Mo.</span>
                    </div>
                </Dropzone>
            ) : (
                <React.Fragment>
                    <Dropzone>
                        <Stack>
                            <input {...getInputProps()} name="file" />
                            <div {...getRootProps()}>
                                <IconButton small>
                                    <CloudUpload />
                                </IconButton>
                            </div>
                            <IconButton small onClick={() => setDatas((data: any) => ({ ...data, image: null }))}>
                                <Delete />
                            </IconButton>
                        </Stack>
                        <Image
                            src={getDropzoneImg(datas.image)}
                            height={140}
                            width={300}
                            style={{ display: 'block', height: '100%', width: "auto", maxWidth: '400px', maxHeight: 200, margin: '0 auto' }}
                            alt={datas.name || 'dropzone'}
                            title={datas.name}
                        />
                        <p>
                            {datas.image.name}
                        </p>
                    </Dropzone>
                </React.Fragment>
            )}
        </DropzoneContainer>
    )
}

const DropzoneContainer = styled.div`
    display        : flex;
    flex-direction : column;
    align-items    : center;
`

const Dropzone = styled.div`
    position        : relative;
    display         : flex;
    flex-direction  : column;
    align-items     : center;
    justify-content : center;
    height          : 100%;
    width           : 100%;
    padding         : 35px;
    background      : repeating-conic-gradient(rgb(var(--bg-two-rgb)) 0%, rgb(var(--bg-two-rgb)) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
    border-radius   : var(--rounded-sm);
    border          : 1px solid;
    border-color    : transparent;
    cursor          : pointer;
    border          : 1px solid var(--light-border);

    &.active,
    &:hover {
        border-color : var(--primary);
        background   : repeating-conic-gradient(rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.2) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
    }

    .svg-container {
        width            : 60px;
        height           : 60px;
        padding          : 12px;
        background-color : var(--bg-two);
        border           : 1px solid var(--light-border);
        border-radius    : var(--rounded-full);
        box-shadow       : var(--shadow-sm), var(--shadow-relief);
        margin-bottom    : 10px;

        svg {
            width  : 100%;
            height : 100%;
        }
    }

    .dropzone-text {
        text-align       : center;
        font-size        : 15px;
        padding          : 15px;
        color            : var(--text);
        background-color : var(--bg-two);
        border-radius    : var(--rounded-sm);
        box-shadow       : var(--shadow-sm), var(--shadow-relief);
    }

    p {
        padding-top        : 20px;
        max-width          : 100%;
        color              : var(--text);
        overflow           : hidden;
        text-overflow      : ellipsis;
        display            : -webkit-box;
        -webkit-line-clamp : 1;
        -webkit-box-orient : vertical;
    }
`

const Stack = styled.div`
    display        : flex;
    flex-direction : row;
    align-items    : center;
    position       : absolute;
    right          : 7px;
    top            : 7px;

    > * {
        margin-left : 5px;
    }
`