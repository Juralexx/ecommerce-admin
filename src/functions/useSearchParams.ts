import { useRouter } from 'next/router';
import React from 'react'
import { DateRange } from 'react-day-picker';
import { dateParser, formatDate } from './utils';

interface Props {
    filters: any[] | null;
}

function arrayToQueryParams(array: any[]) {
    const parts = array.map((param) => {
        return encodeURIComponent(param.name) + '=' + encodeURIComponent(param.value);
    });
    return parts.join('&');
}

const useSearchParams = ({ filters }: Props) => {
    const router = useRouter()
    const [activeFilters, setActiveFilters] = React.useState<Record<string, any>[]>([])

    function populateQuery() {
        let filters = activeFilters.map(e => ({ name: e.parameter, value: e.value }))
        let query: Record<string, any> = {}

        for (let i = 0; i < filters.length; i++) {
            const name = filters[i].name
            const value = filters[i].value

            if (i > 0 && query[name]) {
                if (name === filters[i - 1].name) {
                    query[name] = query[name] + ',' + value
                }
            } else {
                query[name] = filters[i].value
            }
        }

        // let url = `${router.pathname}?${query}`
        router.push({ query: { ...query } })
    }

    /**
     * 
     * @param filter 
     * @param prop 
     */

    const onFilterClick = (filter: any, prop: string, unique?: boolean) => {
        let filters = [...activeFilters]

        let index = -1

        if (!unique) {
            index = filters.findIndex(el => (el[prop] === filter[prop]) && (el.value === filter.value))

            if (index === -1) {
                setActiveFilters(prev => [...prev, filter])
            } else {
                filters.splice(index, 1)
                setActiveFilters(filters)
            }
        } else {
            index = filters.findIndex(el => el[prop] === filter[prop])

            if (index === -1) {
                setActiveFilters(prev => [...prev, filter])
            } else {
                if (filter.value !== filters[index].value) {
                    filters.splice(index, 1)
                    setActiveFilters([...filters, filter])
                } else {
                    filters.splice(index, 1)
                    setActiveFilters(filters)
                }
            }
        }
    }

    /**
     * 
     * @param param 
     */

    const removeFilters = (param: string | Array<string>, value?: string | boolean | number) => {
        let filters = [...activeFilters]

        if (Array.isArray(param)) {
            param.forEach(p => {
                if (value) {
                    filters = filters.filter(el => el.parameter !== p && el.value !== value)
                } else {
                    filters = filters.filter(el => el.parameter !== p)
                }
            })
        } else {
            if (value) {
                filters = filters.filter(el => el.parameter !== param && el.value !== value)
            } else {
                filters = filters.filter(el => el.parameter !== param)
            }
        }
        setActiveFilters(filters)
        return filters
    }

    /**
     * 
     * @param param 
     */

    //supprimer par rapport a la valeur et non la propriete

    const removeQueryParams = (param: string | Array<string>, value?: string | boolean | number) => {

        if (param.includes('from')) {
            if (typeof param === 'string')
                param = [param, 'to']
            else param = [...param, 'to']
        }

        const filters = removeFilters(param, value)
        let query = arrayToQueryParams(filters.map(e => ({ name: e.parameter, value: e.value })))
        return router?.push(`${router.pathname}?${query}`)
    };

    /**
     * 
     */

    const onReset = () => {
        setActiveFilters([])
        router?.replace({ query: {} })
    }

    /**
     * 
     */

    React.useEffect(() => {
        filters?.forEach((f) => {
            let query
            if (Array.isArray(f)) {
                f.forEach(el => {
                    query = router!.query[el.parameter]
                    if (query && query === el.value) {
                        if (!activeFilters.some(el => el[el.parameter] === el.value)) {
                            setActiveFilters(prev => ([...prev, el]))
                        }
                    }
                })
            } else {
                query = router!.query[f.parameter]
                if (query && query === f.value) {
                    if (!activeFilters.some(el => el[f.parameter] === f.value)) {
                        setActiveFilters(prev => ([...prev, f]))
                    }
                }
            }
        })
    }, [])

    React.useEffect(() => {
        
    })

    const [datepicker, setDatepicker] = React.useState<boolean>(false)

    const defaultSelected: DateRange = {
        from: undefined,
        to: undefined
    };

    const [range, setRange] = React.useState<DateRange | undefined>(defaultSelected);

    React.useEffect(() => {
        const query = router!.query
        if (query.from && Date.parse(query.from as string)) {
            if (!query.to) {
                setActiveFilters(prev => [...prev, { label: dateParser(query.from), parameter: 'from', value: query.from }])
                setRange({ from: new Date(query.from as string) })
            } else {
                if (Date.parse(query.to as string)) {
                    setActiveFilters(prev => [
                        ...prev,
                        { label: `du ${dateParser(query.from)} au ${dateParser(query.to)}`, parameter: 'from', value: query.from },
                        { parameter: 'to', value: query.to },
                    ])
                    setRange({ from: new Date(query.from as string), to: new Date(query.to as string) })
                }
            }
        }
    }, [router])

    React.useEffect(() => {
        if (range && range.from) {
            removeFilters(['from', 'to'])
            if (!range.to) {
                setActiveFilters(prev => [...prev, { label: dateParser(range.from), parameter: 'from', value: formatDate(range.from) }])
            } else {
                setActiveFilters(prev => [
                    ...prev,
                    { label: `du ${dateParser(range.from)} au ${dateParser(range.to)}`, parameter: 'from', value: formatDate(range.from) },
                    { parameter: 'to', value: formatDate(range.to) },
                ])
            }
        }
    }, [range])

    return {
        activeFilters,
        setActiveFilters,
        populateQuery,
        removeFilters,
        removeQueryParams,
        onReset,
        onFilterClick,
        datepicker,
        setDatepicker,
        range,
        setRange
    }
}

export default useSearchParams