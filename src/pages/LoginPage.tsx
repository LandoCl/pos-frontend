import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl p-6">
        <CardHeader className="text-center pb-2">
          <div className="text-4xl mb-2 flex justify-center">☕</div>
          <CardTitle className="text-2xl font-bold text-[#3B1F0E]">
            Cacao & Vainilla
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Bienvenido a nuestro sistema</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            <Button
              onClick={() => loginWithRedirect()}
              className="w-full bg-[#3B1F0E] hover:bg-[#5a3015] text-white"
              disabled={isLoading}
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: "signup",
                  },
                })
              }
              variant="outline"
              className="w-full border-[#3B1F0E] text-[#3B1F0E] hover:bg-[#3B1F0E] hover:text-white"
              disabled={isLoading}
            >
              Crear nueva cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}