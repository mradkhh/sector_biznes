import {BaseQueryFn, createApi, FetchArgs} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

const API = 'https://jsonplaceholder.typicode.com'

interface CustomError {
    status: number
}


export const fetchApi = createApi({
    reducerPath: 'fetchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API}) as BaseQueryFn<string | FetchArgs, unknown, CustomError>,
    tagTypes: ['Fetch'],
    endpoints(builder)  {
        return {
            // =--------- USER FETCH -------------------=
            fetchGetPosts: builder.query<[], {}>({
                query: (params) => ({
                    url: '/posts',
                    params : {
                        ...params
                    }
                }),
                providesTags: () => ['Fetch'],
            }),
            fetchEditMe: builder.mutation<any, { }>({
                query: (body) => ({
                    url: '',
                    method: 'POST',
                    body: {
                        ...body
                    },
                }),
                invalidatesTags: ['Fetch']
            }),
        }
    }
})

export const {
    useFetchGetPostsQuery
} = fetchApi










