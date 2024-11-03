import { useState,useEffect } from "react";
import axios from "axios";
import { LocationData } from "../types";

export const useLocation=()=>{
    const[location,setLocation]=useState<LocationData>({
       country:'',
       city:''
    });
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState<string |null>()

    useEffect(()=>{
        const fetchLocation = async ()=>{
            try{
              const response = await axios.get('https://ipapi.co/json/')
              setLocation({
                country:response.data.country_name,
                city:response.data.city
              })
            }catch(error:any){

            }
        }
    })
}