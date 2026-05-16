const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { User, UpdateUser, CreateUserRequestType, AuthCallbackUserType } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'sonner';
export function useGetUser() {
    const { getAccessTokenSilently } = useAuth0();

    const getUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user");
        }

        return res.json();
    };

    return useQuery({
        queryKey: ["user"],
        queryFn: getUserRequest,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();
    const createUserRequest = async (user: CreateUserRequestType) => {
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
        mutationFn: (user: CreateUserRequestType) => createUserRequest(user),
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

export function useRegisterUser() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();
    const registerRequest = async (user: AuthCallbackUserType) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken
            },
            body: JSON.stringify(user)
        })
        if (!res.ok) throw new Error('Error al registrar el usuario')
        return res.json();
    }
    return useMutation({
        mutationFn: (user: AuthCallbackUserType) => registerRequest(user),
        onError: (err) => console.log(err),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] })
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();
    const updateUserRequest = async (formData: UpdateUser) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/user', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        if (!res.ok) throw new Error("Error al actualizar el usuario");
        return res.json();
    }
    return useMutation({
        mutationFn: (formData: UpdateUser) => updateUserRequest(formData),
        onError: (err) => {
            toast.error("Error al actualizar el usuario");
            console.log(err);
            throw new Error("Error al actualizar el usuario")
        },
        onSuccess: (user) => {
            toast.success("Perfil del usuario actualizado");
            console.log(user);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    })
}