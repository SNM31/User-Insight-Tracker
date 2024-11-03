import axios from "axios";
import { error } from "console";
import { config } from "process";

const api=axios.create({
    baseURL:'http://localhost:8080/api',
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
})

api.interceptors.request.use(
    (config)=>{
        config.headers = config.headers || {};
        const token=localStorage.getItem('token')
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config;
    },
    (error)=>Promise.reject(error)
);
export default api;