import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Carrier, PageProps } from '@/types';
import { Layout } from '@/layouts';
import Breadcrumb from "@/components/global/Breadcrumb";
import { Alert, Button, Grid, Input, Stack, Textarea, Zone } from '@/components/global';
import useError from '@/functions/useError';
import { isAdmin } from '@/functions/functions';
import { updateCarrier, getCarrier } from '@/api/carriers';

interface Props extends PageProps {
    carrier: Carrier.Options
}

export default function AddCarrier({ user, router, carrier }: Props) {
    const [datas, setDatas] = React.useState<Carrier.Options>({ ...carrier })
    const { error, setError } = useError()

    const update = async (e: any) => {
        e.preventDefault()
        setError({ error: '', message: '' })

        const config = { ...datas }

        const { errors } = await updateCarrier(carrier, config)
        if (errors.message) {
            setError(errors)
        } else {
            router!.replace(`/carriers`)
        }
    }

    return (
        <Layout user={user} router={router} title={`Modifier : ${carrier.name} - Transporteur`}>
            <form
                onSubmit={update}
                encType="multipart/form-data"
                method="post"
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: "center" }}
                    justifyContent={{ xs: 'flex-start', sm: "space-between" }}
                >
                    <div>
                        <h2>Modifier : {carrier.name}</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
                </Stack>
                <Zone>
                    <Grid xs={1} sm={2} spacing={{ xs: 0, sm: 2 }}>
                        <div style={{ marginBottom: '12px' }}>
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
                        </div>
                        <div>
                            <Input
                                type="number"
                                lang="fr"
                                step="0.01"
                                name="Prix"
                                placeholder='Prix'
                                value={datas.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, price: Number(e.target.value) }))}
                                isError={error.error === 'price'}
                            />
                            {error.error === 'price' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                    <div>
                        <Textarea
                            name="Description"
                            placeholder='description'
                            value={datas.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, description: e.target.value }))}
                            isError={error.error === 'description'}
                        />
                        {error.error === 'description' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                </Zone>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    if (!isAdmin(user!.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    const { carrier } = await getCarrier(params!.id as string)

    return {
        props: {
            user,
            carrier
        }
    }
}