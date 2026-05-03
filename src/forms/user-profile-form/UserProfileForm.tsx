"use client"
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(4, { message: "El nombre es requerido" }),
    username: z.string().min(4, { message: "El usuario es requerido" }),
    rol: z.enum(["Admin", "User"])
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (userProfileData: UserFormData) => void;
    title?: string;
    description?: string;
    buttonText?: string;
    isCreating?: boolean;
}

export default function UserProfileForm({
    onSave,
    title = "Datos del usuario",
    description = "Consulta y cambia las credenciales de tu cuenta",
    buttonText = "Guardar cambios",
    isCreating = false
}: Props) {
    const form = useForm<UserFormData>({
        defaultValues: {
            name: "",
            username: "",
            rol: "User"
        },
        resolver: zodResolver(formSchema)
    })
    function onSubmit(data: UserFormData) {
        onSave(data);
    }
    return (
        <Card>
            <form id="user-profile-form"
                onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 bg-gray-50 rounded-lg md:pd-10'>
                <CardHeader>
                    <CardTitle>
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Controller name="email" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input {...field} disabled={!isCreating}
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Teclea tu email"
                                        className="bg-white" />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                    </FieldGroup>
                    <FieldGroup>
                        <Controller name="name" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Nombre</FieldLabel>
                                    <Input {...field}
                                        id="name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Teclea tu nombre"
                                        className="bg-white mt-4" />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                    </FieldGroup>
                    <div className="flex flex-col md:flex-row gap-4 mt-">
                        <FieldGroup>
                            <Controller name="username" control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <FieldLabel>Usuario</FieldLabel>
                                        <Input {...field}
                                            id="username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Teclea tu usuario"
                                            className="bg-white mt-4" />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                        <FieldGroup>
                            <Controller name="rol" control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <FieldLabel>Rol</FieldLabel>
                                        <Input {...field}
                                            id="rol"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Teclea el rol del usuario"
                                            className="bg-white mt-4" />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>
                    <CardFooter>
                        <Button type="submit" form="user-profile-form" className='bg-[#3B1F0E] hover:bg-[#5F3D1B] text-white'>
                            {buttonText}
                        </Button>
                    </CardFooter>
                </CardContent>
            </form>
        </Card>
    )
}