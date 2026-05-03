import UserProfileForm, { type UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import PageHeader from "@/components/PageHeader";
import { useCreateUser } from "@/api/UserApi";
import { useNavigate } from "react-router";

export default function CreateUserPage() {
    const createUserRequest = useCreateUser();
    const navigate = useNavigate();

    const handleSave = (data: UserFormData) => {

        createUserRequest.mutate({
            email: data.email || "",
            name: data.name,
            username: data.username,
            rol: data.rol
        }, {
            onSuccess: () => {
                navigate("/users");
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <PageHeader title="Nuevo Usuario" />

            <UserProfileForm
                onSave={handleSave}
                title="Registrar Usuario"
                description="Ingresa los datos para registrar un nuevo usuario en el sistema."
                buttonText="Crear usuario"
                isCreating={true}
            />
        </div>
    );
}
