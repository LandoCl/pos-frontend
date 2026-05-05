"use client"

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// Interfaz del producto
export type BackEndProduct = {
    _id?: string;
    code: string;
    name: string;
    category: string;
    sale_price: number;
    purchase_price: number;
    stock: number;
    min_stock: number;
    units: string;
    provider: string;
};

// Esquema de validación
const formSchema = z.object({
    code: z.string().min(1, 'El código es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    category: z.string().min(1, 'Selecciona una categoría válida'),
    sale_price: z.coerce.number().min(0, 'El precio debe ser un valor positivo'),
    purchase_price: z.coerce.number().min(0, 'El precio debe ser un valor positivo'),
    stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
    min_stock: z.coerce.number().min(0, 'El stock mínimo no puede ser negativo'),
    units: z.string().min(1, 'Selecciona una unidad de medida'),
    provider: z.string().min(1, 'El proveedor es requerido'),
});

export type ProductFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (productData: ProductFormData) => void;
    getProduct?: BackEndProduct | null; 
}

export default function ProductForm({ onSave, getProduct }: Props) {
    const form = useForm<ProductFormData>({
        defaultValues: {
            code: '',
            name: '',
            category: '', // Comienza vacío para obligar a seleccionar uno
            sale_price: 0,
            purchase_price: 0,
            stock: 0,
            min_stock: 0,
            units: '',    // Comienza vacío para obligar a seleccionar uno
            provider: ''
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any    
    });

    function onSubmit(data: ProductFormData) {
        onSave(data);
    }

    useEffect(() => {
        if (getProduct) {
            form.reset(getProduct);
        }
    }, [getProduct, form]);

    return (
        <Card className="border-0 shadow-none bg-white">
            <form id='product-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                
                <CardHeader className="pb-4 px-0 pt-0">
                    <CardTitle className="font-black text-[#3B1F0E] uppercase text-xl">
                        {getProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Ingresa los detalles del café, jarabe, o insumo para tu inventario.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 px-0">
                    {/* Fila 1: Código, Nombre y Categoría */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <FieldGroup className="flex-1">
                            <Controller
                                name='code'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Código</FieldLabel>
                                        <Input
                                            {...field}
                                            id='code'
                                            placeholder='Ej: CAFE-001'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                            disabled={!!getProduct}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>

                        <FieldGroup className="flex-2 w-full md:w-1/2">
                            <Controller
                                name='name'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Producto</FieldLabel>
                                        <Input
                                            {...field}
                                            id='name'
                                            placeholder='Ej: Grano Café / Jarabe Vainilla'
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
                                name='category'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Categoría</FieldLabel>
                                        {/* Selector Estático de Categoría */}
                                        <select
                                            {...field}
                                            id='category'
                                            className='flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B1F0E]'
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            <option value="materia prima">Materia prima</option>
                                            <option value="decoracion">Decoración</option>
                                            <option value="moldes">Moldes</option>
                                            <option value="utensilios">Utensilios</option>
                                            <option value="medicion">Medición</option>
                                            <option value="empaquetado">Empaquetado</option>
                                        </select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                    {/* Fila 2: Precios */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <FieldGroup className="flex-1">
                            <Controller
                                name='purchase_price'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Costo de Compra</FieldLabel>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            id='purchase_price'
                                            placeholder='0.00'
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
                                name='sale_price'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Precio de Venta</FieldLabel>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            id='sale_price'
                                            placeholder='0.00'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                    {/* Fila 3: Inventario (Stock) */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <FieldGroup className="flex-1">
                            <Controller
                                name='stock'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Stock Actual</FieldLabel>
                                        <Input
                                            {...field}
                                            type="number"
                                            id='stock'
                                            placeholder='0'
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
                                name='min_stock'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Stock Mínimo</FieldLabel>
                                        <Input
                                            {...field}
                                            type="number"
                                            id='min_stock'
                                            placeholder='0'
                                            className='bg-gray-50 border-gray-200 focus-visible:ring-[#3B1F0E]'
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>
                    </div>

                    {/* Fila 4: Unidades y Proveedor */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <FieldGroup className="flex-1">
                            <Controller
                                name='units'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Unidad de Medida</FieldLabel>
                                        {/* Selector Estático de Unidades */}
                                        <select
                                            {...field}
                                            id='units'
                                            className='flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B1F0E]'
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            <option value="pieza">Pieza</option>
                                            <option value="kilo">Kilo</option>
                                            <option value="unidad">Unidad</option>
                                        </select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                        </FieldGroup>

                        <FieldGroup className="flex-1">
                            <Controller
                                name='provider'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Proveedor</FieldLabel>
                                        <Input
                                            {...field}
                                            id='provider'
                                            placeholder='Ej: Finca Santa VeraCruz'
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
                        <Button type='submit' form='product-form' className='bg-[#3B1F0E] hover:bg-[#5a3015] text-white px-6 rounded-xl font-semibold transition-colors'>
                            {getProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                        </Button>
                    </Field>
                </CardFooter>
            </form>
        </Card>
    );
}