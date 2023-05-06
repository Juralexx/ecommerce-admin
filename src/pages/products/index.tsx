import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/api/session'
import { PageProps, Product } from "@/types";
import { EditNote, Start, Add, Apps, ViewHeadline, Delete, Panorama, Close } from '@mui/icons-material';
import { Layout, RootPagesLayout } from "@/layouts";
import { ToolMenu, Button, Divider, IconButton, ConfirmDialog, SidePagination, CardHeader, CardContent, Card, Grid, Table, TableRow, TableCell, ImageBG, Tag, Select, FormControlLabel, Checkbox, Zone } from '@/components/global';
import { deleteProduct, getProducts } from '@/api/products';
import { isNotUser } from '@/functions/functions';
import useSortableTable from '@/functions/useSortableTable';
import { getCategories } from '@/api/categories';
import FilterMenu, { Displayer } from '@/components/global/FilterMenu';
import { DatePicker } from '@/components/global/DatePicker';
import { Category } from '@/types';
import useSearchParams from '@/functions/useSearchParams';
import { getTotal } from '@/functions/utils';

interface Props extends PageProps {
    products: Product.Options[];
    count: number;
    currentPage: number;
    limit: number;
    categories: Partial<Category.Options>[]
}

export default function Products({ user, router, products, count, currentPage, limit, categories }: Props) {
    const [display, setDisplay] = React.useState<string>('table')
    const [remove, setRemove] = React.useState<Record<string, any>>({ state: false, item: null })

    const ActionMenu = ({ product, horizontale = false }: any) => {
        return (
            <ToolMenu horizontale={horizontale}>
                <Link href={`/products/${product._id}`}>
                    <Start fontSize="small" /> Voir
                </Link>
                {isNotUser(user!?.role) && (
                    <React.Fragment>
                        <Link href={`/products/${product._id}/update`}>
                            <EditNote /> Modifier
                        </Link>
                        <Divider />
                        <div onClick={() => setRemove({ state: true, item: product })}>
                            <Delete fontSize="small" /> Supprimer
                        </div>
                    </React.Fragment>
                )}
            </ToolMenu>
        )
    }

    const [datas, setDatas] = React.useState({ products, count, currentPage, limit })

    React.useEffect(() => {
        setDatas({ products, count, currentPage, limit })
    }, [products, limit, count])

    const { sortedDatas, sortTable, config } = useSortableTable({
        datas: datas.products,
        config: [
            '',
            { label: 'Nom', action: () => sortTable('name') },
            { label: 'Catégorie', action: () => sortTable('category.name') },
            'Stock',
            'Variants',
            'Prix',
            { label: 'Status', action: () => sortTable('published') },
        ]
    })

    const filters = [
        { label: 'Publié', parameter: 'published', value: 'true' },
        { label: 'Non publié', parameter: 'published', value: 'false' },
        { label: 'En stock', parameter: 'stock', value: 'in' },
        { label: 'En rupture', parameter: 'stock', value: 'out' },
    ]

    const {
        activeFilters,
        setActiveFilters,
        populateQuery,
        removeQueryParams,
        onReset,
        onFilterClick,
        datepicker,
        setDatepicker,
        range,
        setRange
    } = useSearchParams({ filters: filters })

    const [category, setCategory] = React.useState<Partial<Category.Options | undefined>>({ name: '' })

    React.useEffect(() => {
        const query = router!.query
        if (query.category) {
            const cat = categories.find((cat: any) => cat._id === query['category'])
            setCategory(cat)
            setActiveFilters(prev => ([...prev, { parameter: 'category', value: `${cat!._id}` }]))
        }
    }, [router])

    return (
        <Layout user={user} router={router} title='Produits'>
            <RootPagesLayout
                title='Produits'
                filters={
                    <React.Fragment>
                        <FilterMenu
                            onValidate={() => populateQuery()}
                            onReset={() => onReset()}
                        >
                            <div className="cells" onClick={() => setDatepicker(true)}>
                                <FormControlLabel control={<Checkbox onClick={() => { }} checked={datepicker || range?.from !== undefined} />}>
                                    Date
                                </FormControlLabel>
                            </div>
                            {filters.map((filter: Record<string, any>, i: number) => {
                                return (
                                    <div className="cells" key={i}>
                                        <FormControlLabel control={<Checkbox onClick={() => onFilterClick(filter, 'parameter', true)} checked={activeFilters.some(el => el.label === filter.label)} />}>
                                            {filter.label}
                                        </FormControlLabel>
                                    </div>
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
                        <Select
                            placeholder="Catégorie"
                            readOnly
                            value={category!.name}
                            onChange={() => { }}
                            onClean={() => {
                                removeQueryParams('category')
                                setCategory({ name: '' })
                            }}
                            style={{ minWidth: 200 }}
                        >
                            {categories?.length > 0 && (
                                categories.map((category, i) => (
                                    <div key={i} onClick={() => {
                                        setCategory(category)
                                        router?.push({ query: { ...router.query, category: category._id } })
                                    }}>
                                        {category.name}
                                    </div>
                                ))
                            )}
                        </Select>
                    </React.Fragment>
                }
                addButton={
                    isNotUser(user!?.role) && (
                        <Button href='/products/add' mobileFull icon={<Add />}>Ajouter</Button>
                    )}
                toolsRight={
                    <IconButton noBg onClick={() => setDisplay(display === 'grid' ? 'table' : 'grid')}>
                        {display === 'table' ? <Apps /> : <ViewHeadline />}
                    </IconButton>
                }
            >
                {activeFilters.length > 0 && (
                    <Displayer>
                        {activeFilters.map((filter, key) => {
                            return (
                                filter.label && (
                                    <Tag key={key}>
                                        {filter.label}
                                        <Close onClick={() => removeQueryParams(filter.parameter)} />
                                    </Tag>
                                )
                            )
                        })}
                    </Displayer>
                )}
                {display === 'grid' ? (
                    <Grid xs={1} sm={2} lg={3} xl={4} xxl={6} spacing={2} alignSelf="flex-start">
                        {sortedDatas &&
                            sortedDatas.map((product: Product.Options, i: number) => {
                                return (
                                    <Card key={i}>
                                        <CardHeader
                                            action={<ActionMenu product={product} />}
                                            title={product.name}
                                            subtitle={product.category.name}
                                        />
                                        {product.images!.length > 0 ? (
                                            <Image
                                                src={`${process.env.SERVER_URL}${product.images![0].path}`}
                                                height={140}
                                                width={300}
                                                style={{ height: 140, width: "100%", objectFit: 'cover' }}
                                                alt={product.name}
                                                title={product.name}
                                            />
                                        ) : (
                                            <ImageBG>
                                                <Panorama />
                                                <p>Aucune image</p>
                                            </ImageBG>
                                        )}
                                        <CardContent ellipsis={3}>
                                            <Tag
                                                name={product.published ? 'Publié' : 'Non publié'}
                                                color={product.published ? 'success-color' : 'danger-color'}
                                                beforeColor={product.published ? 'success-color' : 'danger-color'}
                                                rounded="md"
                                                style={{ position: 'absolute', top: -40, left: 4 }}
                                            />
                                            <div dangerouslySetInnerHTML={{ __html: product.content }} />
                                        </CardContent>
                                    </Card>
                                )
                            })}
                    </Grid>
                ) : (
                    <Table thead={config}>
                        {sortedDatas &&
                            sortedDatas.map((product, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {product.images!.length > 0 &&
                                                <Image
                                                    src={`${process.env.SERVER_URL}${product.images![0].path}`}
                                                    height={40}
                                                    width={40}
                                                    style={{ width: 40, height: 40, borderRadius: 4 }}
                                                    alt={product.name}
                                                    title={product.name}
                                                />
                                            }
                                        </TableCell>
                                        {[
                                            product.name,
                                            product.category.name,
                                            `${getTotal(product.variants, 'stock', 0)} dans ${product.variants.length} variants`,
                                            product.variants.length || '-',
                                            `${product.variants.length} prix`
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
                                                name={product.published ? 'Publiée' : 'Dépubliée'}
                                                color={product.published ? 'success-color' : 'danger-color'}
                                                beforeColor={product.published ? 'success-color' : 'danger-color'}
                                                rounded="md"
                                            />
                                        </TableCell>
                                        <TableCell className="call-to-action">
                                            <ActionMenu product={product} horizontale={true} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </Table>
                )}
                {sortedDatas &&
                    sortedDatas.length === 0 &&
                    <Zone style={{ textAlign: 'center' }}>
                        Aucun résultat
                    </Zone>
                }
                <SidePagination
                    array={datas.products}
                    router={router}
                    currentPage={datas.currentPage}
                    count={datas.count}
                    limit={datas.limit}
                />
                <ConfirmDialog
                    title="Voulez-vous vraiment supprimer ce produit ?"
                    text="Cette action est irréversible."
                    confirmButton='Supprimer'
                    open={remove.state}
                    onClose={() => setRemove({ state: false, item: null })}
                    onConfirm={() => {
                        deleteProduct(remove.item)
                        router!.replace(router!.asPath)
                    }}
                />
            </RootPagesLayout>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, query } = context
    const user = await isAuthenticated(req, res)

    const { products, count, currentPage, limit } = await getProducts({ ...query, select: '-description -content' })
    const { categories } = await getCategories({ select: 'name', populate: 'false' })

    return {
        props: {
            user,
            products,
            count,
            currentPage,
            limit,
            categories
        }
    }
}