import React from "react";

interface Props {
    datas: any[];
    config: any[] | null;
}

const useSortableTable = ({ datas, config = null }: Props) => {
    const [direction, setDirection] = React.useState<string>('asc')
    const [sortField, setSortedField] = React.useState<string | number | null>(null);

    const originalesDatas = React.useMemo(() => { if (datas) return [...datas] }, [datas])

    const sortedDatas = React.useMemo(() => {
        if (!datas) return

        let sortableItems = [...datas];
        if (sortField !== null) {
            if (typeof sortField === 'number') {
                if (config![sortField]?.sortAction) {
                    sortableItems = config![sortField].sortAction(datas, direction, config![sortField].accessor)
                }
            } else {
                sortableItems = sortableItems.sort((a, b) => {
                    if (sortField.split('.').length === 1) {
                        if (a[sortField] === null) return 1;
                        if (b[sortField] === null) return -1;
                        if (a[sortField] === null && b[sortField] === null) return 0;
                        return (
                            a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                                numeric: true,
                            }) * (direction === "asc" ? 1 : -1)
                        );
                    } else {
                        const params = sortField.split('.')
                        const firstField = a[params[0]][params[1]]
                        const secondField = b[params[0]][params[1]]

                        if (firstField === null) return 1;
                        if (secondField === null) return -1;
                        if (firstField === null && secondField === null) return 0;
                        return (
                            firstField.toString().localeCompare(secondField.toString(), "en", {
                                numeric: true,
                            }) * (direction === "asc" ? 1 : -1)
                        );
                    }
                });
            }
        } else {
            sortableItems = originalesDatas || []
        }
        return sortableItems;
    }, [datas, sortField, direction]);

    const sortTable = (field: string | null) => {
        if (sortField && sortField === field && direction === 'asc') {
            setDirection('desc');
        } else setDirection('asc')
        setSortedField(field);
    }

    return { sortedDatas: sortedDatas, direction, sortTable, config };
}

export default useSortableTable