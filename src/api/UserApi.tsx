const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { User } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

export function useCreateUser() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();
    const createUserRequest = async (user: User) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken
            },
            body: JSON.stringify(user)
        })
        if (!res.ok) {
            console.log(res);
            throw new Error('Error al crear el usuario')
        }
        return res.json();
    }
    return useMutation({
        mutationFn: (user: User) => createUserRequest(user),
        onError: (err) => {
            console.log(err);
            throw new Error('Error al crear el usuario')
        },
        onSuccess: (user) => {
            console.log(user);
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    });
}