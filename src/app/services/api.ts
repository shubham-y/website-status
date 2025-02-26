import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/components/constants/url';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL
})

export const api = createApi({
    baseQuery,
    /**
     * Tag types must be defined in the original API definition
     * for any tags that would be provided by injected endpoints
   */
    tagTypes:['Users','Status'],
     /**
     * This api has endpoints injected in adjacent files,
     * which is why no endpoints are shown below.
   */
    endpoints: () => ({}),
})