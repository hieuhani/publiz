import { LogoFull } from "@/components/LogoFull";
import { SignInForm } from "@/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

const SignIn: React.FunctionComponent = () => {
  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <LogoFull />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back,</CardTitle>
          <CardDescription>Please sign in with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});
