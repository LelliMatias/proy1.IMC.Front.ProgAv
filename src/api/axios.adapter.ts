import axios from "axios";

export interface HttpApadter {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data?: {altura: number, peso: number}): Promise<T>;
}

export class ApiAxiosAdapter implements HttpApadter {
    private readonly axios = axios; // En caso de que axios cambie de nombre o algo se donde tengo que cambiar luego

    async get<T>(url: string) { // defino que el metodo es generico <T>, es decir que puede trabajar con cualquier tipo
        const { data } = await this.axios.get<T>(url); // Aseguro que sea del tipo T en lugar de any
        return data;
    }

    async post<T>(url: string, data?: {altura: number, peso: number}) {
        const { data: response } = await this.axios.post<T>(url, data); // Aseguro que sea del tipo T en lugar de any
        return response; 
    }
}