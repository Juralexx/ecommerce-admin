import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { PageProps, Customer } from "@/types";
import { Layout, RootPagesLayout } from "@/layouts";
import { Button, ConfirmDialog, ToolMenu, Divider, Table, TableRow, TableCell, Avatar, SidePagination } from '@/components/global';
import { EditNote, Start, Add, Delete } from '@mui/icons-material';
import { isAdmin } from '@/functions/functions';
import { deleteCustomer, getCustomers } from '@/api/customers';
import { dateParser, getTotal } from '@/functions/utils';
import useSortableTable from '@/functions/useSortableTable';

interface Props extends PageProps {
    customers: Customer.Options[];
    count: number;
    currentPage: number;
    limit: number;
}

export default function Customers({ user, router, customers, count, currentPage, limit }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    const [datas, setDatas] = React.useState({ customers, count, currentPage, limit })

    React.useEffect(() => {
        setDatas({ customers, count, currentPage, limit })
    }, [customers, limit, count])

    const { sortedDatas, sortTable, config } = useSortableTable({
        datas: datas.customers,
        config: [
            '',
            { label: 'Prénom', action: () => sortTable('name') },
            { label: 'Nom', action: () => sortTable('lastname') },
            { label: 'Email', action: () => sortTable('email') },
            'Commandes',
            'Total',
            { label: 'Inscription', action: () => sortTable('registration_date') }
        ]
    })

    return (
        <Layout user={user} router={router} title='Clients'>
            <RootPagesLayout
                title='Clients'
                addButton={
                    isAdmin(user!.role) && (
                        <Button href='/customers/add' mobileFull>
                            <Add /> Ajouter
                        </Button>
                    )
                }
            >
                <Table thead={config}>
                    {sortedDatas &&
                        sortedDatas.map((customer, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Avatar>
                                            {customer.name!.charAt(0)}
                                        </Avatar>
                                    </TableCell>
                                    {[
                                        customer.name,
                                        customer.lastname,
                                        customer.email,
                                        customer.orders.length,
                                        getTotal(customer.orders, 'price', 2) + '€',
                                        dateParser(customer.registration_date)
                                    ]
                                        .map((el: any, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            )
                                        })}
                                    <TableCell className="call-to-action">
                                        <ToolMenu horizontale={true} style={{ marginLeft: 'auto' }}>
                                            <Link href={`/customers/${customer._id}`}>
                                                <Start fontSize="small" /> Voir
                                            </Link>
                                            {isAdmin(user!.role) && (
                                                <React.Fragment>
                                                    <Link href={`/customers/${customer._id}/update`}>
                                                        <EditNote /> Modifier
                                                    </Link>
                                                    <Divider />
                                                    <div onClick={() => setRemove({ state: true, item: customer })}>
                                                        <Delete fontSize="small" /> Supprimer
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        </ToolMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </Table>
                <SidePagination
                    array={datas.customers}
                    router={router}
                    currentPage={datas.currentPage}
                    count={datas.count}
                    limit={datas.limit}
                />
            </RootPagesLayout>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer ce client ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deleteCustomer(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, query } = context;
    const user = await isAuthenticated(req, res)
    const { customers, count, currentPage, limit } = await getCustomers({ ...query })

    return {
        props: {
            user,
            customers,
            count,
            currentPage,
            limit,
        }
    }
}