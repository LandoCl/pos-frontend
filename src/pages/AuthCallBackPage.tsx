import { useRegisterUser } from "@/api/UserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
export default function AuthCallBackPage() {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const createUserRequest = useRegisterUser();

    const hasCreatedUser = useRef(false)
    useEffect(() => {
        if (user?.sub && user?.email && user?.nickname) {
            const realUsername = user['https://miapp.com/username'] as string || user.nickname;
            createUserRequest.mutate({ auth0Id: user.sub, email: user.email, username: realUsername })
            hasCreatedUser.current = true;
        }
        navigate('/');
    }, [createUserRequest, navigate, user])
    return (
        <div>Loading</div>
    )
}
