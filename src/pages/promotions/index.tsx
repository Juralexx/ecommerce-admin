import React from 'react'
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session';
import { PageProps, Promotion } from "@/types";
import { Layout, RootPagesLayout } from "@/layouts";
import { Button, ConfirmDialog, ToolMenu, Divider, Table, TableRow, TableCell, Tag } from '@/components/global';
import { EditNote, Start, Add, Delete } from '@mui/icons-material';
import { getDateStatus, isAdmin } from '@/functions/functions';
import { dateParser } from '@/functions/utils';
import useSortableTable from '@/functions/useSortableTable';
import { deletePromotion, getPromotions } from '@/api/promotions';

interface Props extends PageProps {
    promotions: Promotion.Options[]
}

export default function Promotions({ user, router, promotions }: Props) {
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    const [datas, setDatas] = React.useState<Promotion.Options[]>([])

    React.useEffect(() => setDatas([...promotions]), [promotions])

    const { sortedDatas, sortTable, config } = useSortableTable({
        datas: datas,
        config: [
            '',
            { label: 'Code', action: () => sortTable('code') },
            { label: 'Valeur', action: () => sortTable('value') },
            'Description',
            { label: 'Début', action: () => sortTable('start_date') },
            { label: 'Fin', action: () => sortTable('end_date') },
            '',
            { label: 'Status', action: () => sortTable('is_active') },
        ]
    })

    return (
        <Layout user={user} router={router} title='Promotions'>
            <RootPagesLayout
                title='Promotions'
                addButton={
                    isAdmin(user!?.role) && (
                        <Button href='/promotions/add' mobileFull>
                            <Add /> Ajouter
                        </Button>
                    )
                }
            >
                <Table thead={config}>
                    {sortedDatas &&
                        sortedDatas.map((promotion, i) => {
                            return (
                                <TableRow key={i}>
                                    {[
                                        i + 1,
                                        promotion.code,
                                        promotion.type === 'percentage' ? `${promotion.value}%` : `${promotion.value}€`,
                                        promotion.description,
                                        promotion.start_date ? dateParser(promotion.start_date) : '-',
                                        promotion.end_date ? dateParser(promotion.end_date) : '-',
                                        getDateStatus(promotion.start_date, promotion.end_date)
                                    ]
                                        .map((el: any, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            )
                                        })}
                                    <TableCell>
                                        <Tag
                                            name={promotion.is_active ? 'Actif' : 'Inactif'}
                                            color={promotion.is_active ? `success-color` : 'danger-color'}
                                            beforeColor={promotion.is_active ? `success-color` : 'danger-color'}
                                            rounded="md"
                                        />
                                    </TableCell>
                                    <TableCell className="call-to-action">
                                        <ToolMenu horizontale={true} style={{ marginLeft: 'auto' }}>
                                            <Link href={`/promotions/${promotion._id}`}>
                                                <Start fontSize="small" /> Voir
                                            </Link>
                                            {isAdmin(user!.role) && (
                                                <React.Fragment>
                                                    <Link href={`/promotions/${promotion._id}/update`}>
                                                        <EditNote /> Modifier
                                                    </Link>
                                                    <Divider />
                                                    <div onClick={() => setRemove({ state: true, item: promotion })}>
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
            </RootPagesLayout>
            <ConfirmDialog
                title="Voulez-vous vraiment supprimer cette promotion ?"
                text='Cette action est irréversible.'
                confirmButton='Supprimer'
                open={remove.state}
                onClose={() => setRemove({ state: false, item: null })}
                onConfirm={() => {
                    deletePromotion(remove.item)
                    router!.replace(router!.asPath)
                }}
            />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
    const user = await isAuthenticated(req, res)
    const { promotions } = await getPromotions()

    return {
        props: {
            user,
            promotions
        }
    }
}