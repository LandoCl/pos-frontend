import { useUpdateUser } from "@/api/UserApi"
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm"

export default function UserProfilePage() {
    const updateUserRequest = useUpdateUser();
    return (
        <UserProfileForm onSave={updateUserRequest.mutate} />
    )
}
