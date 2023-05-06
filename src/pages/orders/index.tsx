import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { Order, PageProps } from "@/types";
import { EditNote, Start, Add, Close } from '@mui/icons-material';
import { Layout, RootPagesLayout } from "@/layouts";
import { ToolMenu, Button, Divider, Table, TableRow, TableCell, Tag, FormControlLabel, Checkbox, Zone, SidePagination } from '@/components/global';
import { getStatusColor, isNotUser } from '@/functions/functions';
import useSortableTable from '@/functions/useSortableTable';
import FilterMenu, { Displayer, FilterSubMenu } from '@/components/global/FilterMenu';
import { DatePicker } from '@/components/global/DatePicker';
import useSearchParams from '@/functions/useSearchParams';
import { getOrders } from '@/api/orders';
import { numericDateParser } from '@/functions/utils';

interface Props extends PageProps {
    orders: Order.Options[];
    count: number;
    currentPage: number;
    limit: number;
}

export default function Orders({ user, router, orders, count, currentPage, limit }: Props) {
    const [datas, setDatas] = React.useState({ orders, count, currentPage, limit })

    React.useEffect(() => {
        setDatas({ orders, count, currentPage, limit })
    }, [orders, limit, count])

    /**
     * 
     */

    const { sortedDatas, sortTable, config } = useSortableTable({
        datas: datas.orders,
        config: [
            { label: 'N°', action: () => sortTable('key') },
            { label: 'Date', action: () => sortTable('date') },
            { label: 'Client', action: () => sortTable('customer.email') },
            { label: 'Paiment', action: () => sortTable('payment_status') },
            { label: 'Status', action: () => sortTable('status') },
            { label: 'Prix', action: () => sortTable('price') },
        ]
    })

    /**
     * 
     */

    const filters = [
        [
            { type: 'Paiement', label: 'Payée', parameter: 'payment_status', value: 'paid' },
            { type: 'Paiement', label: 'En attente', parameter: 'payment_status', value: 'awaiting' },
            { type: 'Paiement', label: 'Annulée', parameter: 'payment_status', value: 'canceled' },
            { type: 'Paiement', label: 'Acceptée', parameter: 'payment_status', value: 'accepted' },
        ],
        [
            { type: 'Status', label: 'En préparation', parameter: 'status', value: 'preparation' },
            { type: 'Status', label: 'Terminée', parameter: 'status', value: 'completed' },
            { type: 'Status', label: 'Envoyée', parameter: 'status', value: 'shipped' },
            { type: 'Status', label: 'Livrée', parameter: 'status', value: 'delivered' },
            { type: 'Status', label: 'Annulée', parameter: 'status', value: 'canceled' },
        ]
    ]

    const {
        activeFilters,
        populateQuery,
        removeQueryParams,
        onReset,
        onFilterClick,
        datepicker,
        setDatepicker,
        range,
        setRange
    } = useSearchParams({ filters: filters })

    return (
        <Layout user={user} router={router} title='Commandes'>
            <RootPagesLayout
                title='Commandes'
                filters={
                    <FilterMenu
                        onValidate={() => populateQuery()}
                        onReset={() => onReset()}
                    >
                        <div className="cells" onClick={() => setDatepicker(true)}>
                            <FormControlLabel control={<Checkbox checked={datepicker || range?.from !== undefined} />}>
                                Date
                            </FormControlLabel>
                        </div>
                        {filters.map((filter: Record<string, any>, i: number) => {
                            return (
                                <React.Fragment key={i}>
                                    {!Array.isArray(filter) ? (
                                        <div className="cells">
                                            <FormControlLabel control={<Checkbox onClick={() => onFilterClick(filter, 'parameter')} checked={activeFilters.some(el => el.parameter === filter.parameter && el.value === filter.value)} />}>
                                                {filter.label}
                                            </FormControlLabel>
                                        </div>
                                    ) : (
                                        <FilterSubMenu name={filter[0].type}>
                                            {filter.map((f, key) => {
                                                return (
                                                    <div className="cells" key={key}>
                                                        <FormControlLabel control={<Checkbox onClick={() => onFilterClick(f, 'parameter')} checked={activeFilters.some(el => el.parameter === f.parameter && el.value === f.value)} />}>
                                                            {f.label}
                                                        </FormControlLabel>
                                                    </div>
                                                )
                                            })}
                                        </FilterSubMenu>
                                    )}
                                </React.Fragment>
                            )
                        })}
                        {datepicker &&
                            <DatePicker
                                mode="range"
                                open={datepicker}
                                setOpen={setDatepicker}
                                selected={range}
                                onSelect={setRange}
                            />
                        }
                    </FilterMenu>
                }
                addButton={
                    isNotUser(user!?.role) && (
                        <Button href='/orders/add' mobileFull icon={<Add />}>Ajouter</Button>
                    )}
            >
                {activeFilters.length > 0 && (
                    <Displayer>
                        {activeFilters.map((filter, key) => {
                            return (
                                filter.label && (
                                    <Tag key={key}>
                                        {filter.type} : {filter.label}
                                        <Close onClick={() => removeQueryParams(filter.parameter)} />
                                    </Tag>
                                )
                            )
                        })}
                    </Displayer>
                )}
                <Table thead={config}>
                    {sortedDatas &&
                        sortedDatas.map((order, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        #{order.key}
                                    </TableCell>
                                    <TableCell>
                                        {numericDateParser(order.date)} {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        {order.customer.email}
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
                {sortedDatas &&
                    sortedDatas.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucun résultat
                    </Zone>
                }
                <SidePagination
                    array={datas.orders}
                    router={router}
                    currentPage={datas.currentPage}
                    count={datas.count}
                    limit={datas.limit}
                />
            </RootPagesLayout>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, query } = context
    const user = await isAuthenticated(req, res)

    const { orders, count, currentPage, limit } = await getOrders({ ...query })

    return {
        props: {
            user,
            orders,
            count,
            currentPage,
            limit,
        }
    }
}