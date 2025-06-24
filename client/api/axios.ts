// import { router } from 'next/client';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "next/router";
import { PaginatedResult } from "@/models/pagination";
import { store } from "@/store/store";

const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

const createAxiosInstance = (baseURL: string, withCredentials = false): AxiosInstance => {
    const instance = axios.create({ baseURL, withCredentials: withCredentials });

    instance.interceptors.response.use(
        async response => {
            await sleep(500); // Optional: add delay for dev
            //Handle Pagination in Headers
            const pagination = response.headers['pagination'];
            if (pagination) {
                response.data = new PaginatedResult(response.data, JSON.parse(pagination));
                return response as AxiosResponse<PaginatedResult<any>>;
            }
            return response;
        },
        (error: AxiosError) => {
            const { data, status, config, headers } = error.response as AxiosResponse;
            switch (status) {
                case 400:
                    if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                        router.push('/not-found');
                    }
                    if (data.errors) {
                        const modelStateErrors = [];
                        for (const key in data.errors) {
                            if (data.errors[key]) {
                                modelStateErrors.push(data.errors[key]);
                            }
                        }
                        throw modelStateErrors.flat();
                    } else {
                        toast.error(data);
                    }
                    break;
                case 401:
                    if (headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
                        toast.error('Session expired - please login again');
                    } else {
                        toast.error('Unauthorized');
                    }
                    break;
                case 403:
                    toast.error('Forbidden');
                    break;
                case 404:
                    router.push('/server-error');
                    break;
                case 500:
                    store.commonStore.setError(data);
                    router.push('/error/server-error');
                    break;
            }

            return Promise.reject(error);
        }
    );

    instance.interceptors.request.use(config => {
        // Add token if needed
        // const token = store.commonStore.token;
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    return instance;
};

export const endpoint1 = createAxiosInstance("https://localhost:5000/api/", false);
