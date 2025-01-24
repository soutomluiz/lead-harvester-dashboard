import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { SignUpForm } from "./auth/SignUpForm";
import { AuthError } from "./auth/AuthError";
import { AuthStateManager } from "./auth/AuthStateManager";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <AuthStateManager>
      <div className="container max-w-lg mx-auto py-8">
        <Card className="p-8">
          <div className="mb-8 space-y-4">
            <img src="/logo.svg" alt="Logo" className="h-24 mx-auto" />
            <p className="text-center text-gray-600">
              {isSignUp ? "Crie sua conta" : "Faça login para acessar sua conta"}
            </p>
          </div>

          <AuthError message={error} />

          <Tabs defaultValue="login" onValueChange={(value) => setIsSignUp(value === "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AuthStateManager>
  );
}