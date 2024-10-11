import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { HTTPError } from "ky";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInSchemaPayload = z.infer<typeof signInSchema>;

type Props = {
  initialEmail?: string;
  initialPassword?: string;
};
export const SignInForm: React.FunctionComponent<Props> = ({
  initialEmail,
  initialPassword,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInSchemaPayload>({
    resolver: zodResolver(signInSchema),
    mode: "all",
    defaultValues: {
      email: initialEmail || "",
      password: initialPassword || "",
    },
  });

  const mutationSignIn = useMutation({
    mutationFn: async ({ email, password }: SignInSchemaPayload) => {
      const response = await authService.signIn(email, password);
      return response;
    },
    onSuccess: () => {
      navigate({ to: "/" });
      toast.success("Welcome to the admin dashboard!");
    },
    onError: async (exception) => {
      if (exception instanceof HTTPError) {
        const error = await exception.response.json();
        toast.error(error.error.message);
      }
    },
  });

  const handleSignIn = (payload: SignInSchemaPayload) => {
    mutationSignIn.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email">Admin email</Label>
        <Input type="email" id="email" {...register("email")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || mutationSignIn.isPending}>
          Sign in
        </Button>
      </div>
    </form>
  );
};
