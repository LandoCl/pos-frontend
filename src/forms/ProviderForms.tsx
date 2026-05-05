import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// Interfaz del proveedor basada exactamente en tu backend actual
export type BackEndProvider = {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    address: string;
};

// Esquema de validación con Zod
const formSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    phone: z.string().min(8, 'Ingresa un número de teléfono válido'),
    email: z.string().email('Ingresa un correo electrónico válido'),
    address: z.string().min(5, 'La dirección es demasiado corta'),
});

export type ProviderFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (providerData: ProviderFormData) => void;
    // Puede ser null o undefined si el formulario se usa para crear un proveedor nuevo
    getProvider?: BackEndProvider | null; 
}

export default function ProviderForm({ onSave, getProvider }: Props) {
    const form = useForm<ProviderFormData>({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            address: ''
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any    
    });

    function onSubmit(data: ProviderFormData) {
        onSave(data);
    }

    useEffect(() => {
        if (getProvider) {
            form.reset({
                name: getProvider.name || '',
                phone: getProvider.phone || '',
                email: getProvider.email || '',
                address: getProvider.address || '',
            });
        }
    }, [getProvider, form]);

    return (
        <Card className="border-0 shadow-none bg-white">
            <form id='provider-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                
                <CardHeader className="pb-4 px-0 pt-0">
                    <CardTitle className="font-black text-[#3B1F0E] uppercase text-xl">
                        {getProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Ingresa los datos de contacto del distribuidor de insumos, harinas o empaques.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 px-0">
                    {/* Fila 1: Nombre de la Empresa */}
                    <div className="w-full">
                        <FieldGroup>
                            <Controller
                                name='name'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Nombre / Empresa</FieldLabel>
                                        <Input
                                            {...field}
                                            id='name'
                                            placeholder='Ej: Lácteos La Pradera / Empaques Cacao'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                    {/* Fila 2: Teléfono y Correo */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <FieldGroup className="flex-1">
                            <Controller
                                name='phone'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Teléfono de Contacto</FieldLabel>
                                        <Input
                                            {...field}
                                            type="tel"
                                            id='phone'
                                            placeholder='Ej: 555-123-4567'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>

                        <FieldGroup className="flex-1">
                            <Controller
                                name='email'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Correo Electrónico</FieldLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            id='email'
                                            placeholder='Ej: ventas@lapraderas.com'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                    {/* Fila 3: Dirección */}
                    <div className="w-full">
                        <FieldGroup>
                            <Controller
                                name='address'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Dirección Física</FieldLabel>
                                        <Input
                                            {...field}
                                            id='address'
                                            placeholder='Ej: Av. del Molino 123, Bodega 4'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                </CardContent>
                <CardFooter className='px-0 pt-4'>
                    <Field orientation='horizontal' className="w-full flex justify-end">
                        <Button type='submit' form='provider-form' className='bg-[#3B1F0E] hover:bg-[#5a3015] text-white px-6 rounded-xl font-semibold transition-colors'>
                            {getProvider ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                        </Button>
                    </Field>
                </CardFooter>
            </form>
        </Card>
    );
}