import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next'
import styled from 'styled-components';
import { isAuthenticated } from '@/api/session';
import { Edit, EditNote } from '@mui/icons-material';
import { Layout } from "@/layouts";
import { Order, OrderStatus, PageProps } from "@/types";
import Breadcrumb from "@/components/global/Breadcrumb";
import { Zone, Divider, Grid, Stack, Tag, ToolMenu, ImageBG, Input } from '@/components/global';
import { getStatusColor, isNotUser } from '@/functions/functions';
import { getOrder, updateOrder } from '@/api/orders';
import { dateParser, numberWithSpaces, numericDateParser } from '@/functions/utils';
import TimelineItems from '@/components/TimelineItems';
import useAlert from '@/contexts/useAlert';

interface Props extends PageProps {
    order: Order.Options
}

export default function OrderPage({ user, router, order }: Props) {
    const { setAlert } = useAlert()
    const [message, setMessage] = React.useState<string>('')

    async function handleMessage(event: any) {
        if (event.which === 13) {
            const { errors } = await updateOrder(order, {
                timeline: {
                    type: 'message',
                    message: event.target.value,
                    user: {
                        _id: user!._id,
                        name: user!.name,
                        lastname: user!.lastname,
                        email: user!.email
                    },
                    date: new Date()
                }
            })
            if (errors.message) {
                setAlert('Une erreur s\'est produite...', 'error')
            } else {
                setMessage('')
                router!.replace(router!.asPath)
            }
        }
    }

    async function updateOrderStatus(status: string) {
        const { errors } = await updateOrder(order, {
            status: status as OrderStatus,
            timeline: {
                type: 'order_status',
                status: status,
                user: {
                    _id: user!._id,
                    name: user!.name,
                    lastname: user!.lastname,
                    email: user!.email
                },
                date: new Date()
            }
        })
        if (errors.message) {
            setAlert('Une erreur s\'est produite...', 'error')
        } else {
            router!.replace(router!.asPath)
        }
    }

    return (
        <Layout user={user} router={router} title={'Commande #' + order.key + ' - Commandes'}>
            <Breadcrumb />
            <div className="row">
                <div className="col-12 col-lg-8 px-2">
                    <Zone>
                        <h2>{'Commande #' + order.key + ''}</h2>
                        <p>{dateParser(order.date)}, {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                        <div className="absolute right-3 top-3">
                            <Stack
                                direction='row'
                                alignItems="center"
                                spacing={{ xs: 1, md: 2 }}
                            >
                                <Tag
                                    name={order.payment_status}
                                    color={`${getStatusColor(order.payment_status)}-color`}
                                    beforeColor={getStatusColor(order.payment_status)}
                                    rounded="md"
                                />
                                {isNotUser(user!?.role) && (
                                    <ToolMenu horizontale={true}>
                                        <React.Fragment>
                                            <Link href={`/orders/${order._id}/update`}>
                                                <EditNote /> Modifier
                                            </Link>
                                            <Divider />
                                            <h4 className="pt-4 px-4 mb-1">Status</h4>
                                            {order.status !== 'preparation' &&
                                                <div onClick={() => updateOrderStatus('preparation')}>
                                                    En préparation
                                                </div>
                                            }
                                            {order.status !== 'completed' &&
                                                <div onClick={() => updateOrderStatus('completed')}>
                                                    Terminée
                                                </div>
                                            }
                                            {order.status !== 'shipped' &&
                                                <div onClick={() => updateOrderStatus('shipped')}>
                                                    Envoyée
                                                </div>
                                            }
                                            {order.status !== 'canceled' &&
                                                <div onClick={() => updateOrderStatus('canceled')}>
                                                    Annulée
                                                </div>
                                            }
                                        </React.Fragment>
                                    </ToolMenu>
                                )}
                            </Stack>
                        </div>
                        <div className='flex mt-3'>
                            <Tag
                                name={order.status}
                                color={`${getStatusColor(order.status)}-color`}
                                beforeColor={getStatusColor(order.status)}
                                rounded="md"
                            />
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
                                <p>{order.customer.email}</p>
                            </div>
                            <div>
                                <p className="label txt-sec">
                                    Téléphone
                                </p>
                                <p>{order.customer?.phone || '-'}</p>
                            </div><div>
                                <p className="label txt-sec">
                                    Paiement
                                </p>
                                <p>{order.payment_method}</p>
                            </div>
                        </Stack>
                    </Zone>
                    <Zone>
                        <h2 className='mb-4'>Détails</h2>
                        {order.products.map((element, i) => {
                            const { product, price, number } = element
                            return (
                                <div className='flex xs:flex-col items-center justify-between py-4' key={i}>
                                    <div className='flex items-center xs:items-start mr-4 xs:mr-0 max-w-3/4 xs:w-full'>
                                        <div className='min-w-[50px] h-[50px] mr-5 flex-shrink'>
                                            {product.images![0]?.path ? (
                                                <Image
                                                    src={`${process.env.SERVER_URL}${product.images![0].path}`}
                                                    height={60}
                                                    width={60}
                                                    alt={product.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <ImageBG className="object-cover w-full h-full" />
                                            )}
                                        </div>
                                        <div className='inline-block'>
                                            <p className='max-w-[300px] xs:max-w-full xs:-mt-2'>
                                                {product.name}<br />({element.variant.width}cm x {element.variant.height}cm)
                                            </p>
                                            <p className='txt-sec'>Référence : {element.variant.ref}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between w-1/4 xs:w-1/2 xs:ml-auto xs:mt-2'>
                                        <div className='txt-sec'>
                                            {price.toFixed(2)}€
                                        </div>
                                        <div className='txt-sec mx-2'>
                                            x{number}
                                        </div>
                                        <div className='inline-block'>
                                            {(number * price).toFixed(2)}€
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <Divider />
                        <div className='flex items-center justify-between py-4'>
                            <p className='bold'>Sous-total</p>
                            <p>{order.price}€</p>
                        </div>
                        <div className='flex items-center justify-between py-4'>
                            <p className='bold'>Frais de livraison</p>
                            <p>{order.shipping_fees.toString().padEnd(4, '0')}€</p>
                        </div>
                        <div className='flex items-center justify-between py-4'>
                            <p className='bold'>Total</p>
                            <p className='text-3xl bold'>{numberWithSpaces(order.price)}€</p>
                        </div>
                    </Zone>
                    <Grid xs={1} sm={2} spacing={2}>
                        <Zone>
                            <h3>Adresse de livraison</h3>
                            <p>{order.customer?.name} {order.customer?.lastname}</p>
                            <p>{order.delivery_address.street}</p>
                            <p>{order.delivery_address.postcode} {order.delivery_address.city}</p>
                            <p>{order.delivery_address.department}, {order.delivery_address.region}</p>
                            <p>{order.customer?.phone}</p>
                        </Zone>
                        <Zone>
                            <h3>Adresse de facturation</h3>
                            <p>{order.customer?.name} {order.customer?.lastname}</p>
                            <p>{order.billing_address.street}</p>
                            <p>{order.billing_address.postcode} {order.billing_address.city}</p>
                            <p>{order.billing_address.department}, {order.billing_address.region}</p>
                            <p>{order.customer?.phone}</p>
                        </Zone>
                    </Grid>
                    <Zone>
                        <h3>Transporteur</h3>
                        <p><strong>Date </strong> : {numericDateParser(order.date)}</p>
                        <p><strong>Transporteur  </strong> : {order.carrier.name}</p>
                        <p><strong>Frais de port </strong> : {(order.shipping_fees).toString().padEnd(4, '0')}€</p>
                        <p><strong>Numéro de suivi </strong> : -</p>
                    </Zone>
                    <Zone>
                        <h3>Client</h3>
                        <p>{order.customer?.title} {order.customer?.name} {order.customer?.lastname}</p>
                        <p>{order.customer?.email}</p>
                        <p>{order.customer?.phone}</p>
                        <div className='absolute right-3 top-3'>
                            <ToolMenu horizontale={true}>
                                <Link href={`/customers/${order.customer._id}`}>
                                    <EditNote /> Voir
                                </Link>
                            </ToolMenu>
                        </div>
                    </Zone>
                </div>
                <div className="col-12 col-lg-4 px-2">
                    <Timeline>
                        <div className='timeline-header'>
                            <h2 className="mb-4">
                                Timeline
                            </h2>
                            <ToolMenu horizontale={true} className="menu">
                                {isNotUser(user!?.role) && (
                                    <React.Fragment>
                                        <Link href={`/orders/${order._id}/update`}>
                                            <EditNote /> Modifier
                                        </Link>
                                        <Divider />
                                    </React.Fragment>
                                )}
                            </ToolMenu>
                            <Input
                                placeholder='Écrire une note...'
                                icon={<Edit />}
                                value={message}
                                onKeyDown={handleMessage}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                            />
                        </div>
                        {order.timeline.map((item: any, i: number) => {
                            return (
                                <TimelineItems item={item} key={i} />
                            )
                        })}
                    </Timeline>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    const user = await isAuthenticated(req, res)

    const { order } = await getOrder(params!.id as string)

    return {
        props: {
            user,
            order
        }
    }
}

const Timeline = styled.div`
    position         : relative;
    margin-top       : 16px;
    background-color : var(--bg-zero);
    border-radius    : var(--rounded-sm);
    border           : 1px solid var(--light-border);
    overflow         : hidden;

    .timeline-header {
        padding       : 20px;
        border-bottom : 1px solid var(--light-border);

        .menu {
            position : absolute;
            top      : 10px;
            right    : 10px;
        }
    }
`