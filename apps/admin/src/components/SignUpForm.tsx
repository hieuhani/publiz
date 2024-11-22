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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { SignInForm } from "./SignInForm";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignUpSchemaPayload = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = useForm<SignUpSchemaPayload>({
    resolver: zodResolver(signUpSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [emailExists, setEmailExists] = useState(false);

  const mutationSignUp = useMutation({
    mutationFn: ({ email, password }: SignUpSchemaPayload) => {
      return authService.signUpAdminUser(email, password);
    },
    onSuccess: () => {
      navigate({ to: "/" });
      toast.success("Welcome to the admin dashboard!");
    },
    onError: async (exception) => {
      if (exception instanceof HTTPError) {
        const error = await exception.response.json();
        if (error.error.message === "EMAIL_EXISTS") {
          setEmailExists(true);
        } else {
          toast.error(error.error.message);
        }
      }
    },
  });

  const handleSignUp = (payload: SignUpSchemaPayload) => {
    mutationSignUp.mutate(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">Admin email</Label>
          <Input type="email" id="email" {...register("email")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" {...register("password")} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || mutationSignUp.isPending}>
            Create admin account
          </Button>
        </div>
      </form>
      {emailExists && (
        <Dialog open={true}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>This email has been registered</DialogTitle>
              <DialogDescription>
                Would you like to sign in instead?
              </DialogDescription>
            </DialogHeader>
            <SignInForm
              initialEmail={getValues("email")}
              initialPassword={getValues("password")}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
