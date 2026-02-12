import { axiosInstance as axios } from "@/lib/axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";



export interface DataCollector {
  id: string;
  name: string;
  phone: string;
  telegramUsername: string;
  telegramChatId: string;
  activeTaskId: string;
  createdAt: string;
  updatedAt: string;
}


const getAllUsers = async () => {
 const data = (await axios.get("/api/data-collector")).data
 return data.data;
};




const DataCollectorApi = {
  getAll:{
    useQuery: (options?: UseQueryOptions<DataCollector[]>) => 
      useQuery({
        queryKey: ["data-collector", "getAll"],
        queryFn: getAllUsers,
        ...options
      })
  }
}


export default DataCollectorApi;