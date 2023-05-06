import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import styled from 'styled-components';
import { PageProps } from '@/types';
import { login } from '@/api/auth';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import useError from '@/functions/useError';
import { Input, Alert, Button, FormControlLabel, Checkbox } from '@/components/global';

export default function LogIn({ router }: PageProps) {
    const [datas, setDatas] = React.useState<Record<string, string>>({ email: '', password: '' })
    const [passwordShown, setPasswordShown] = React.useState<boolean>(false)
    const { error, setError } = useError()

    async function handleLogin(e: any) {
        e.preventDefault()

        if (!datas.email)
            return setError({ error: "email", message: 'Veuillez renseigner l\'email.' })
        else if (!datas.email)
            return setError({ error: "password", message: 'Veuillez saisir votre mot de passe.' })
        else setError({ error: "", message: "" })

        const { errors } = await login(datas.email, datas.password)

        if (errors.message) {
            setError(errors)
        } else {
            router!.replace('/')
        }
    }

    const Icon = passwordShown ? Visibility : VisibilityOff

    return (
        <Container>
            <Form>
                <div className='form-header'>
                    <div className='avatar'>
                        <Lock />
                    </div>
                    <h2>Connexion</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className='content'>
                        <Input
                            required
                            id="email"
                            name="Email"
                            placeholder="Email"
                            value={datas.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(prev => ({ ...prev, email: e.target.value }))}
                            isError={error.error === 'email'}
                        />
                        {error.error === 'email' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                    <div className='content'>
                        <Input
                            required
                            id="password"
                            name="Mot de passe"
                            type={passwordShown ? 'text' : 'password'}
                            placeholder="Mot de passe"
                            value={datas.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatas(prev => ({ ...prev, password: e.target.value }))}
                            isError={error.error === 'password'}
                            endIcon={<Icon onClick={() => setPasswordShown(!passwordShown)} />}
                        />
                        {error.error === 'password' &&
                            <Alert type="error">{error.message}</Alert>
                        }
                    </div>
                    <div className='content'>
                        <FormControlLabel
                            control={<Checkbox />}
                        >
                            Se souvenir de moi
                        </FormControlLabel>
                    </div>
                    <div className='content'>
                        <Button type="submit" fullWidth>
                            Connexion
                        </Button>
                    </div>
                    <div className='content'>
                        <Link href="#" className='custom-link'>
                            Mot de passe oublié ?
                        </Link>
                    </div>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12 }}>
                    Copyright © Your Website {new Date().getFullYear()}.
                </p>
            </Form>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)

    if (user) {
        res.writeHead(301, { location: '/' });
        res.end();
    }

    return {
        props: {}
    }
}

const Container = styled.div`
    width            : 100vw;
    height           : 100vh;
    background-color : var(--bg-one);
    display          : flex;
    align-items      : center;
    justify-content  : center;
`

const Form = styled.div`
    width            : 100%;
    max-width        : 500px;
    margin           : auto;
    background-color : var(--bg-zero);
    padding          : 20px;
    border-radius    : var(--rounded-sm);
    border           : 1px solid var(--light-border);

    .form-header {
        display         : flex;
        flex-direction  : column;
        align-items     : center;
        justify-content : center;
        padding         : 20px 0 10px;
    }

    .avatar {
        width            : 50px;
        height           : 50px;
        border-radius    : var(--rounded-lg);
        background-color : var(--primary);
        display          : flex;
        align-items      : center;
        justify-content  : center;
        margin-bottom    : 10px;

        svg {
            height : 30px;
            width  : 30px;
        }
    }

    .content {
        padding : 10px 0;
    }
`