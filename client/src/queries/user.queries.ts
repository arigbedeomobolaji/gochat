import axios from "@src/lib/axios";
import { QueryFunctionContext } from "@tanstack/react-query";


export const getCurrentUser = ({queryKey}: QueryFunctionContext) => {
    const id = queryKey[1];
    return axios.get(`/users/${id}`);
    
}