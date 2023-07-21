import {FC, memo, useState} from 'react';
import SearchInput from "../components/inputs/SearchInput.tsx";
import {useFetchGetPostsQuery} from "../services/fetchServices.ts";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from "@mui/material";
import {DropIcon} from "../assets/icons.tsx";


interface IPost {
    id: number;
    title: string;
    body: string
}

const Home:FC = () => {

    // TODO: Ustun sarlavhalarini bosish yozuvlarni saralaydi (kattadan kichikga yoki alifbo tartibida).
    // TODO: Qidiruv satriga istalgan qiymatni kiritishingiz mumkin va jadvalda ushbu qiymat mavjud bo'lgan yozuv ko'rsatiladi. Barcha ustunlar bo'ylab qidirish.
    // TODO: Jadval sahifasi brauzerning URL manzilida ko'rsatilishi kerak.


    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize: number = 10;

    const { data } = useFetchGetPostsQuery({})

    const createData = ( id: number, title: string, body: string ) => ({ id, title, body })

    const rows = data?.map((item: IPost) => {
        return createData(item?.id, item?.title, item?.body)
    })


    const getCurrentPageData = () => {
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        return rows?.slice(startIdx, endIdx);
    };

    const handlePageChange = (page: number) => {
            if ((page > 0) && (page <= (data?.length / pageSize))) {
                setCurrentPage(page);
            }
    };


  return (
        <>
            <SearchInput/>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" >
                                <TableSortLabel
                                    direction="asc" // "asc", "desc", or false
                                    IconComponent={DropIcon}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" >
                                <TableSortLabel
                                    IconComponent={DropIcon}
                                >
                                    Заголовок
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" >
                                <TableSortLabel
                                    IconComponent={DropIcon}
                                >
                                    Описание
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageData()?.map((row: IPost) => (
                            <TableRow
                                key={row?.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" component="th" scope="row">{row?.id}</TableCell>
                                <TableCell style={{ width: "44%", borderLeft: "1px solid rgba(224, 224, 224, 1)", borderRight: "1px solid rgba(224, 224, 224, 1)"  }} align="left">{row?.title}</TableCell>
                                <TableCell style={{ width: "44%" }} align="left">{row?.body}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={"table__pagination"}>
                <div
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={"table__pagination_prev"}
                >Назад</div>
                <div className={"table__pagination_pages"}>
                    {Array.from({ length: Math.ceil(data?.length / pageSize) }, (_, i: number) => (
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