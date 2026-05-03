import { useUpdateUser } from "@/api/UserApi"
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm"
import PageHeader from "@/components/PageHeader";

export default function UserProfilePage() {
    const updateUserRequest = useUpdateUser();
    return (
        <div className="space-y-6">
            <PageHeader title="Mi Perfil" />

            <div className="max-w-3xl mx-auto w-full">
                <UserProfileForm onSave={updateUserRequest.mutate} />
            </div>
        </div>
    )
}
