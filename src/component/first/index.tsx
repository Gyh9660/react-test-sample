import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {type ChangeEvent, useEffect, useState} from "react";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
};

const firstNames = ['John', 'Jane', 'Chris', 'Mary', 'Robert', 'Linda', 'Michael', 'Jessica', 'David', 'Lisa'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAge(min = 18, max = 65): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const data: Person[] = Array.from({length: 100}, () => ({
    firstName: getRandomItem(firstNames),
    lastName: getRandomItem(lastNames),
    age: getRandomAge(),
}));

const PAGE_SIZE_OPTIONS = [
    {
        value: 20,
        label: '20개씩 보기',
    },
    {
        value: 50,
        label: '50개씩 보기',
    },
    {
        value: 100,
        label: '100개씩 보기',
    },
];
const SORT_OPTIONS = [
    {id: '', label: '정렬 안함'}, // 기본값, 정렬 해제
    {id: 'firstName_asc', label: 'First Name 오름차순'},
    {id: 'firstName_desc', label: 'First Name 내림차순'},
    {id: 'lastName_asc', label: 'Last Name 오름차순'},
    {id: 'lastName_desc', label: 'Last Name 내림차순'},
    {id: 'age_asc', label: 'Age 오름차순'},
    {id: 'age_desc', label: 'Age 내림차순'},
];
const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.display({
        header: ({table}) => (
            <input id="header-checkbox" type="checkbox" checked={table.getIsAllPageRowsSelected()}
                   onChange={table.getToggleAllPageRowsSelectedHandler()}/>
        ),
        id: 'select',
        cell: ({row}) => (
            <input id="row-checkbox" type="checkbox" checked={row.getIsSelected()} disabled={!row.getCanSelect()}
                   onChange={row.getToggleSelectedHandler()}/>
        )
    }),
    columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('age', {
        header: 'Age',
        cell: info => (
            <span
                style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                onClick={() => console.log('age is', info.getValue())}
            >
      {info.getValue()}
    </span>
        ),
    }),
    columnHelper.accessor(data => data.firstName + "_" + data.lastName, {
        header: 'Full Name',
        id: "fullName",
        cell: info => info.getValue(),
    }),
    columnHelper.display({
        header: 'Delete',
        id: 'delete',
        cell: ({row, table}) => (
            <button
                onClick={() => {
                    console.log('delete', row, table)
                }}
                style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
            >
                Delete
            </button>
        )
    })
];

const First = () => {

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    useEffect(() => {
        console.log(rowSelection)
    }, [rowSelection]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        enableRowSelection: true,
        state: {
            rowSelection,
            sorting,
        },
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
        getSortedRowModel: getSortedRowModel(),
    });
    const [sortColumn, setSortColumn] = useState('');
    const handleSortColumnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortColumn(e.target.value);

        if (e.target.value === '') {
            // 정렬 해제: 빈 배열로 초기화
            setSorting([]);
        } else {
            // 예: "firstName_asc" → id: "firstName", desc: false
            const [id, direction] = e.target.value.split('_');
            setSorting([{ id, desc: direction === 'desc' }]);
        }
    };

    return (
        <>
            <div>
                <select
                    className="my-2 rounded-[4px] border-[1px] py-1 pl-2 pr-9 text-sm"
                    value={table.getState().pagination.pageSize} // 현재 페이지 사이즈
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value)); // 페이지 사이즈 변경
                    }}
                >
                    {PAGE_SIZE_OPTIONS.map(({value, label}) => (
                        <option key={label} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <select
                    className="my-2 rounded-[4px] border-[1px] py-1 pl-2 pr-9 text-sm"
                    value={sortColumn} onChange={handleSortColumnChange}>
                    {SORT_OPTIONS.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <table style={{width: `${table.getTotalSize()}px`}}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null :
                                    typeof header.column.columnDef.header === 'function'
                                        ? header.column.columnDef.header(header.getContext())
                                        : header.column.columnDef.header
                                }
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {typeof cell.column.columnDef.cell === 'function' ?
                                    cell.column.columnDef.cell(cell.getContext()) :
                                    cell.column.columnDef.cell
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>

            </table>
            <div className="mt-[10px] flex items-center justify-center gap-2">
                <button
                    disabled={!table.getCanPreviousPage()} // 이전페이지가 없을 때 버튼 비활성화
                    onClick={() => table.firstPage()}
                >
                    {'‹‹'}
                </button>
                <button
                    disabled={!table.getCanPreviousPage()} // 이전페이지가 없을 때 버튼 비활성화
                    onClick={() => table.previousPage()} // 이전 페이지
                >
                    {'‹'}
                </button>

                <div className="text-base font-bold">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>

                <button
                    disabled={!table.getCanNextPage()} // 다음페이지가 없을 때 버튼 비활성화
                    onClick={() => table.nextPage()} // 다음 페이지
                >
                    {'›'}
                </button>
                <button
                    disabled={!table.getCanNextPage()} // 다음페이지가 없을 때 버튼 비활성화
                    onClick={() => table.lastPage()}
                >
                    {'››'}
                </button>
            </div>
        </>
    );
}

export default First;
