import api from "../api/axios.config";
import { AuthRequest,AuthResponse } from "../types";

export const authService={
    async login(credentials:AuthRequest): Promise<AuthResponse>{
        try{
          const response=await api.post<AuthResponse>('/auth/login',credentials,{
            withCredentials: true
          });
          if(response.data.token){
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('username',response.data.username)
          }
          return response.data;
        }catch(error:any){
           throw new Error(error.response?.data?.message || 'Login Failed')
        }
    },
    async register(credentials: AuthRequest): Promise<void> {
        try {
            await api.post('/auth/register', credentials, {
                withCredentials: true
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration Failed');
        }
    },
    logout(){
       localStorage.removeItem('token')
       localStorage.removeItem('username')
    }
};