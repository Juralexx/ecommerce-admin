import React from 'react'
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { Layout } from "@/layouts";
import { Customer, PageProps, Address } from "@/types";
import { Add, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Input, Zone, Grid, Stack, InputCard, Card, IconButton, FormControlLabel, Radio } from '@/components/global';
import Breadcrumb from "@/components/global/Breadcrumb";
import useError from '@/functions/useError';
import { isAdmin } from '@/functions/functions';
import { createCustomer } from '@/api/customers';
import { CardContent } from '@mui/material';
import { deleteItemFromArray, handleObjectProp } from '@/functions/utils';

interface AddCustomerProps extends Customer.Options {
    confirmPassword?: string,
}

export default function AddCustomer({ user, router }: PageProps) {
    const [datas, setDatas] = React.useState<AddCustomerProps>({ ...Customer.defaultProps, confirmPassword: '' })
    const { error, setError } = useError()
    const [passwordShown, setPasswordShown] = React.useState(false)

    const addCustomer = async (e: any) => {
        e.preventDefault()
        let config: Customer.Options = { ...datas }
        if (datas.password !== datas.confirmPassword) {
            return setError({ error: 'confirmPassword', message: 'Les mots de passe ne correspondent pas.' })
        }
        const { errors, data } = await createCustomer(config)
        if (errors.message) {
            setError(errors)
        } else {
            router!.replace(`/customers/${data._id}`)
        }
    }

    const Icon = passwordShown ? Visibility : VisibilityOff

    return (
        <Layout user={user} router={router} title='Création compte client - Clients'>
            <form
                onSubmit={addCustomer}
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
                        <h2>Création compte client</h2>
                        <Breadcrumb />
                    </div>
                    <Button type='submit' mobileFull>
                        Enregistrer
                    </Button>
                </Stack>
                <Zone>
                    <h4>Informations</h4>
                    <Grid xs={1} sm={2} spacing={{ xs: 0, sm: 2 }}>
                        <div style={{ marginBottom: '4px' }}>
                            <label className='form-label mb-3'>
                                Titre
                            </label>
                            <FormControlLabel
                                control={<Radio checked={datas.title === 'M'} />}
                                onClick={() => setDatas(datas => ({ ...datas, title: 'M' }))}
                            >
                                M.
                            </FormControlLabel>
                            <FormControlLabel
                                control={<Radio checked={datas.title === 'Mme'} />}
                                onClick={() => setDatas(datas => ({ ...datas, title: 'Mme' }))}
                            >
                                Mme
                            </FormControlLabel>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                            <InputCard
                                name="Prénom"
                                placeholder='Prénom'
                                value={datas.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, name: e.target.value }))}
                                isError={error.error === 'name'}
                            />
                            {error.error === 'name' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                            <InputCard
                                name="Nom"
                                placeholder='Nom'
                                value={datas.lastname}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, lastname: e.target.value }))}
                                isError={error.error === 'lastname'}
                            />
                            {error.error === 'lastname' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                        <div>
                            <InputCard
                                name="Téléphone"
                                placeholder='Téléphone'
                                value={datas.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, phone: e.target.value }))}
                                isError={error.error === 'phone'}
                            />
                            {error.error === 'phone' &&
                                <Alert type="error">{error.message}</Alert>
                            }
                        </div>
                    </Grid>
                </Zone>
                <Zone>
                    <h4>Identifiants de connexion</h4>
                    <Grid xs={1} sm={2} spacing={{ xs: 0, sm: 2 }}>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Email"
                                    placeholder='Email'
                                    value={datas.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, email: e.target.value }))}
                                    isError={error.error === 'email'}
                                />
                                {error.error === 'email' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <InputCard
                                    name="Mot de passe"
                                    placeholder='Mot de passe'
                                    value={datas.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, password: e.target.value }))}
                                    type={passwordShown ? 'text' : 'password'}
                                    endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                                    isError={error.error === 'password'}
                                />
                                {error.error === 'password' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                            <div>
                                <InputCard
                                    name="Confirmer mot de passe"
                                    placeholder='Confirmer mot de passe'
                                    value={datas.confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(datas => ({ ...datas, confirmPassword: e.target.value }))}
                                    type={passwordShown ? 'text' : 'password'}
                                    endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                                    isError={error.error === 'confirmPassword'}
                                />
                                {error.error === 'confirmPassword' &&
                                    <Alert type="error">{error.message}</Alert>
                                }
                            </div>
                        </div>
                    </Grid>
                </Zone>
                <Zone>
                    <Stack
                        direction='row'
                        alignItems="center"
                        spacing={2}
                        style={{ marginBottom: datas.addresses.length > 0 ? '16px' : 0 }}
                    >
                        <h4 className="m-0">Adresses</h4>
                        <IconButton small onClick={() => setDatas(data => ({ ...data, addresses: [...data.addresses, { ...Address.defaultProps }] }))}>
                            <Add />
                        </IconButton>
                    </Stack>
                    {datas.addresses.map((address, i) => {
                        return (
                            <Card className="mt-3" key={i}>
                                <CardContent>
                                    <Grid xs={1} sm={2} lg={3} spacing={2}>
                                        <div>
                                            <Input
                                                name="Rue"
                                                placeholder='Rue'
                                                value={address.street}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, addresses: handleObjectProp(datas.addresses, i, 'street', e.target.value) }))}
                                            />
                                            {error.error === `street-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Ville"
                                                placeholder='Ville'
                                                value={address.city}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, addresses: handleObjectProp(datas.addresses, i, 'city', e.target.value) }))}
                                            />
                                            {error.error === `city-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Code postal"
                                                placeholder='Code postal'
                                                value={address.postcode}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, addresses: handleObjectProp(datas.addresses, i, 'postcode', e.target.value) }))}
                                            />
                                            {error.error === `postcode-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Département"
                                                placeholder='Département'
                                                step="0.01"
                                                min="0"
                                                value={address.department}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, addresses: handleObjectProp(datas.addresses, i, 'department', e.target.value) }))}
                                            />
                                            {error.error === `department-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                        <div>
                                            <Input
                                                name="Région"
                                                placeholder='Région'
                                                value={address.region}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(data => ({ ...data, addresses: handleObjectProp(datas.addresses, i, 'region', e.target.value) }))}
                                            />
                                            {error.error === `region-${i}` &&
                                                <Alert type="error">{error.message}</Alert>
                                            }
                                        </div>
                                    </Grid>
                                    <Stack alignItems="center" spacing={1} style={{ position: 'absolute', top: 5, right: 5 }}>
                                        <IconButton small noBg onClick={() => setDatas(data => ({ ...data, addresses: deleteItemFromArray(datas.addresses, i) }))}>
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Zone>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (!isAdmin(user!.role)) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    return {
        props: {
            user
        }
    }
}