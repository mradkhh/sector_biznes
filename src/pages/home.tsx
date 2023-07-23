import {ChangeEvent, FC, memo, useCallback, useEffect, useState} from 'react';
import SearchInput from "../components/inputs/SearchInput.tsx";
import {useFetchGetPostsQuery} from "../services/fetchServices.ts";
import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import {DropIcon} from "../assets/icons.tsx";
import Spinner from "../components/Spinner.tsx";


interface IPost {
    id: number;
    title: string;
    body: string
}

interface ITableHead {
    id: number;
    property: string;
    title: string;
    direction: boolean
}





const Home:FC = () => {

    const [searchText, setSearchText] = useState<string>('');
    const [posts, setPosts] = useState<IPost[]>([] as IPost[]);
    const [rows, setRows] = useState<IPost[]>([] as IPost[]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [directionBoolean, setDirectionBoolean] = useState<boolean>(true);
    const [ headId, setHeadId ] = useState<number>(0)
    const pageSize: number = 10;

    const { data, isFetching } = useFetchGetPostsQuery({})

    const headCells: ITableHead[] = [
        {
            id: 1,
            property: 'id',
            title: "ID",
            direction: directionBoolean
        },
        {
            id: 2,
            property: 'title',
            title: "Заголовок",
            direction: directionBoolean
        },
        {
            id: 3,
            property: 'body',
            title: "Описание",
            direction: directionBoolean
        },
    ]


    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event?.target?.value);
    }, [searchText])

    const handleSorting = (direction: boolean, property: string, id: number) => {
        const sortedPosts = [...rows]?.sort((a:any, b:any) => {
            if (property === 'id') {
                if (direction) {
                    return a[property] - b[property];
                } else {
                    return b[property] - a[property];
                }
            } else {
                if (direction) {
                    return a[property].localeCompare(b[property]);
                } else {
                    return b[property].localeCompare(a[property]);
                }
            }
        });
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        setPosts(sortedPosts?.slice(startIdx, endIdx));
        setDirectionBoolean(!directionBoolean)
        setHeadId(direction ? id : 0)
    };


    const handlePageChange = useCallback((page: number) => {
        if ((page > 0) && (page <= ( 100 / pageSize))) {
            setCurrentPage(page)
        }
    }, [currentPage])

    const generateHighlightedText = (text: string, highlight: string) => {
        if (highlight?.length) {
            const regex = new RegExp(`(${highlight})`, 'gi');
            const parts = text.split(regex);
            return parts.map((part, index) =>
                    regex.test(part) ? (
                        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
            );
        } else {
            return text
        }
    };

    const updateURL = useCallback((page: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', page.toString());
        const newURL = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newURL);
    }, [])

    useEffect(() => {
        const handlePopstate = () => {
            const searchParams = new URLSearchParams(window.location.search);
            const newPage = Number(searchParams.get('page')) || 1;
            setCurrentPage(newPage);
        };
        window.addEventListener('popstate', handlePopstate);

        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, []);

    useEffect(() => {
        handleSorting(true, 'id', 0)
        setRows(data ? data : [])
        setCurrentPage(1);
    }, [rows])

    useEffect(() => {
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        setPosts( rows?.slice(startIdx, endIdx));
        updateURL(currentPage);
    }, [currentPage]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [posts])

    useEffect(() => {
        handleSorting(true, 'id', 0)
        setHeadId(1)
    }, [])

    return (
        <>
            <SearchInput value={searchText} onChange={handleSearchChange}/>
            <Grid container justifyContent="start">
                <Grid item xs={12} md={12} lg={16}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {
                                        headCells.map((item: ITableHead) =>
                                            <TableCell align="center" >
                                                <TableSortLabel
                                                    key={item.id}
                                                    className={headId !== item.id ? " active_sort" : " inactive_sort"}
                                                    IconComponent={DropIcon}
                                                    onClick={() => handleSorting(item.direction, item.property, item.id)}
                                                >
                                                    { item.title }
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (posts && !isFetching) && posts?.map((row: IPost) => (
                                    <TableRow
                                        key={row?.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell  align="center" component="th" scope="row">{row?.id}</TableCell>
                                        <TableCell style={{
                                            width: '44%',
                                            borderLeft: '1px solid rgba(224, 224, 224, 1)',
                                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                                        }} align="left">{generateHighlightedText(row.title, searchText)}</TableCell>
                                        <TableCell  style={{
                                            width: '44%',
                                        }} align="left">{generateHighlightedText(row.body, searchText)}</TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                        {
                            isFetching && <div className={"loading"}>
                                                <Spinner/>
                                            </div>
                        }
                    </TableContainer>
                </Grid>
            </Grid>
            <div className={"table__pagination"}>
                <div
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={"table__pagination_prev"}
                >Назад</div>
                <div className={"table__pagination_pages"}>
                    {Array.from({ length: Math.ceil(100 / pageSize) }, (_, i: number) => (
                        <div className={ 'table__pagination_page ' + ((currentPage === i + 1) ? "table__pagination_active" : "")} key={i} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={"table__pagination_next"}
                >Далее</div>
            </div>
        </>
  );
};

export default memo(Home);