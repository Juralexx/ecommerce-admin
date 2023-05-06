import React from 'react'
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { Layout } from "@/layouts";
import { Customer, PageProps } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Zone, Divider, Stack, ToolMenu, Table, TableRow, TableCell, Tag, Grid } from '@/components/global';
import { getStatusColor, isAdmin, isNotUser } from '@/functions/functions';
import { getCustomer } from '@/api/customers';
import { dateParser, numericDateParser } from '@/functions/utils';
import { EditNote, Start } from '@mui/icons-material';

interface Props extends PageProps {
    customer: Customer.Options
}

export default function CustomerPage({ user, router, customer }: Props) {
    return (
        <Layout user={user} router={router} title={`${customer?.title}. ${customer?.name} ${customer?.lastname}` + ' - Compte'}>
            <Breadcrumb />
            <Zone>
                <h2>{customer?.title}. {customer?.name} {customer?.lastname}</h2>
                <p>Inscript depuis {dateParser(customer.registration_date)}</p>
                <div className="absolute right-3 top-3">
                    <Stack
                        direction='row'
                        alignItems="center"
                        spacing={{ xs: 1, md: 2 }}
                    >
                        <ToolMenu horizontale={true}>
                            {isAdmin(user!.role) && (
                                <React.Fragment>
                                    <Link href={`/customers/${customer._id}/update`}>
                                        <EditNote /> Modifier
                                    </Link>
                                    <Divider />
                                </React.Fragment>
                            )}
                        </ToolMenu>
                    </Stack>
                </div>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    divider={<Divider orientation="vertical" />}
                    spacing={{ xs: 1, md: 4 }}
                    style={{ marginTop: 15 }}
                >
                    <div>
                        <p className="label txt-sec">
                            Email
                        </p>
                        <p>{customer.email}</p>
                    </div>
                    <div>
                        <p className="label txt-sec">
                            Téléphone
                        </p>
                        <p>{customer?.phone || '-'}</p>
                    </div><div>
                        <p className="label txt-sec">
                            Date de naissance
                        </p>
                        <p>{customer?.birth && numericDateParser(customer?.birth)}</p>
                    </div>
                </Stack>
            </Zone>
            <Zone>
                <h2 className='mb-6'>
                    Commandes
                </h2>
                <Table thead={['N°', 'Date', 'Articles', 'Paiment', 'Status', 'Méthode', 'Prix']}>
                    {customer.orders.length > 0 &&
                        customer.orders.map((order, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        #{order.key}
                                    </TableCell>
                                    <TableCell>
                                        {numericDateParser(order.date)} {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        {order.products.length}
                                    </TableCell>
                                    <TableCell>
                                        <Tag
                                            name={order.payment_status}
                                            color={`${getStatusColor(order.payment_status)}-color`}
                                            beforeColor={getStatusColor(order.payment_status)}
                                            rounded="md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tag
                                            name={order.status}
                                            color={`${getStatusColor(order.status)}-color`}
                                            beforeColor={getStatusColor(order.status)}
                                            rounded="md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {order.payment_method}
                                    </TableCell>
                                    <TableCell>
                                        {order.price}€
                                    </TableCell>
                                    <TableCell className="call-to-action">
                                        <ToolMenu horizontale={true}>
                                            <Link href={`/orders/${order._id}`}>
                                                <Start fontSize="small" /> Voir
                                            </Link>
                                            {isNotUser(user!?.role) && (
                                                <React.Fragment>
                                                    <Link href={`/orders/${order._id}/update`}>
                                                        <EditNote /> Modifier
                                                    </Link>
                                                    <Divider />
                                                </React.Fragment>
                                            )}
                                        </ToolMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </Table>
                {customer.orders &&
                    customer.orders.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucune commandes
                    </Zone>
                }
            </Zone>
            {customer?.addresses.length > 0 ? (
                <Zone>
                    <h2 className='mb-2'>
                        Adresses
                    </h2>
                    <Grid xs={1} sm={2} lg={4} spacing={2}>
                        {customer.addresses.map((adress, i) => {
                            return (
                                <Zone key={i}>
                                    <h3>Adresse {i + 1}</h3>
                                    <p>{adress.street}</p>
                                    <p>{adress.postcode} {adress.city}</p>
                                    <p>{adress.department}, {adress.region}</p>
                                </Zone>
                            )
                        })}
                    </Grid>
                </Zone>
            ) : (
                <Zone style={{ textAlign: 'center' }}>
                    Aucune commandes
                </Zone>
            )}
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { customer } = await getCustomer(params!.id as string)

    return {
        props: {
            user,
            customer
        }
    }
}