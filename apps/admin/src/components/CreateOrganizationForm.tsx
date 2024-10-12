import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { z } from "zod";
import {
  CreateOrganizationInput,
  Organization,
  createOrganization,
  updateOrganization,
} from "@/api";
import { FormItem } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const createOrganizationSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string(),
  verified: z.boolean(),
  ownerId: z.number(),
});

type CreateOrganizationFormSchema = z.infer<typeof createOrganizationSchema>;

type Props = {
  organization?: Organization;
  onCreated?: (organization: Organization) => void;
};
export const CreateOrganizationForm: React.FunctionComponent<Props> = ({
  organization,
  onCreated,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<CreateOrganizationFormSchema>({
    mode: "onBlur",
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: organization?.name || "",
      slug: organization?.slug || "",
      verified: organization?.verified || false,
      description: organization?.description || "",
      ownerId: organization?.ownerId || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (input: CreateOrganizationInput) => {
      if (organization) {
        return updateOrganization(organization.id, input);
      }
      return createOrganization(input);
    },
  });
  const onSubmit = (data: CreateOrganizationFormSchema) =>
    mutation.mutate(data, {
      onSuccess: async (response) => {
        toast.success(`Organization ${organization ? "updated" : "created"}`);
        onCreated?.(response.data);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error(
          `Organization could not be ${organization ? "updated" : "created"}`
        );
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FormItem>
        <Label>Name</Label>
        <Input type="text" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </FormItem>
      <FormItem>
        <Label>Slug</Label>
        <Input type="text" {...register("slug")} />
        {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
      </FormItem>
      <FormItem>
        <Label>Description</Label>
        <Textarea {...register("description")} />

        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </FormItem>
      <Controller
        name="verified"
        control={control}
        render={({ field }) => (
          <FormItem>
            <Label>Verified</Label>
            <div>
              <Switch
                id="airplane-mode"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          </FormItem>
        )}
      />

      <FormItem>
        <Label>Owner ID</Label>
        <Input
          type="number"
          {...register("ownerId", {
            valueAsNumber: true,
          })}
        />

        {errors.ownerId && (
          <p className="text-red-500">{errors.ownerId.message}</p>
        )}
      </FormItem>
      <Button type="submit" className="w-full" disabled={!isValid}>
        {organization ? "Update" : "Create"}
      </Button>
    </form>
  );
};
