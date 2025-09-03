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
    no: number;
    courseName: string;
    trainingType: string;
    channel: string;
    institution: string;
    enrolledCount: number;
    completedCount: number;
    registrationDate: string;
    usedCardCount: number;
    creator: string;
};

const courses = ['리액트 기본', 'Vue 입문', 'Angular 실무', 'Node.js API', 'Python 머신러닝'];
const trainingTypes = ['온라인', '오프라인', '하이브리드'];
const channels = ['유튜브', '줌', '오프라인 강의실', '자체 플랫폼'];
const institutions = ['한국교육원', '서울캠퍼스', '부산교육센터', '청주본부'];
const creators = ['홍길동', '김철수', '박영희', '이순신'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomDateTime = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

const rawData = Array.from({ length: 100 }, () => ({
    enrolledCount: getRandomInt(20, 100),
    completedCount: 0, // 임시 0으로 초기화
    courseName: getRandomItem(courses),
    trainingType: getRandomItem(trainingTypes),
    channel: getRandomItem(channels),
    institution: getRandomItem(institutions),
    registrationDate: getRandomDateTime(new Date(2022, 0, 1), new Date()),
    usedCardCount: getRandomInt(0, 30),
    creator: getRandomItem(creators),
}));

// 등록일자 최신순 정렬 (내림차순)
rawData.sort((a, b) => (a.registrationDate > b.registrationDate ? 1 : -1));

// no 부여 및 completedCount 재설정 예시
const data: Person[] = rawData.map((item, index) => ({
    no: index + 1,
    ...item,
    completedCount: getRandomInt(0, item.enrolledCount), // 이수인원 다시 무작위 생성
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
    {id: 'registrationDate_desc', label: '최근 등록순'},  // 기본값
    {id: 'enrolledCount_desc', label: '학습인원 많은순'},
    {id: 'enrolledCount_asc', label: '학습인원 적은순'},
    {id: 'completedCount_desc', label: '이수인원 많은순'},
    {id: 'completedCount_asc', label: '이수인원 적은순'},
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
    columnHelper.accessor('no', {
        header: 'No',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('courseName', {
        header: '과정명',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('trainingType', {
        header: '교육형태',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('channel', {
        header: 'Channel',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('institution', {
        header: '교육기관',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('enrolledCount', {
        header: '학습인원',
        cell: info => (
            <span
                style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                onClick={() => console.log('age is', info.getValue())}
            >
      {info.getValue()}
    </span>
        ),
    }),
    columnHelper.accessor('completedCount', {
        header: '이수인원',
        cell: info => (
            <span
                style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                onClick={() => console.log('count is', info.getValue())}
            >
      {info.getValue()}
    </span>
        ),
    }),
    columnHelper.accessor('registrationDate', {
        header: '등록일자',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('usedCardCount', {
        header: '사용 카드 수',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('creator', {
        header: '생성자',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor(data => data.channel + "_" + data.institution, {
        header: '테스트',
        id: "test",
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
    const [sorting, setSorting] = useState<SortingState>([
        {id: 'registrationDate', desc: true}
    ]);
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
    const [sortColumn, setSortColumn] = useState('registrationDate_desc');
    const handleSortColumnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortColumn(e.target.value);
        // 예: "firstName_asc" → id: "firstName", desc: false
        const [id, direction] = e.target.value.split('_');
        setSorting([{id, desc: direction === 'desc'}]);

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
