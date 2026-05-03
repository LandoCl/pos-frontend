import { Auth0Provider, type AppState } from "@auth0/auth0-react"
import { useNavigate } from "react-router";

type Props = {
    children: React.ReactNode;
}

function Auth0ProviderWithNavigate({ children }: Props) {
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

    if (!domain || !clientId || !redirectUri) {
        throw new Error('Error al inicializar Auth0')
    }

    const onRedirectCallback = (appState?: AppState) => {
        let targetUrl = appState?.returnTo || "/dashboard";
        if (targetUrl === "/login" || targetUrl === "/") {
            targetUrl = "/dashboard";
        }

        // Redirigimos a la nueva página de callback, pasando la URL destino como state
        navigate('/auth-callback', { state: { returnTo: targetUrl } });
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}

export default Auth0ProviderWithNavigate
