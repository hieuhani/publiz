import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { UnknownKeysParam, z, ZodRawShape } from "zod";
import { CreateOrganizationInput } from "@/api";
import { get } from "@/lib/get";
import { FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

type Props = {
  currentData?: { id: number } & object;
  onCreated?: (updatedData: object) => void;
  schema: z.ZodObject<ZodRawShape, UnknownKeysParam>;
  updateFn: (id: number, input: any) => Promise<{ data: object }>;
  createFn: (input: any) => Promise<{ data: object }>;
};

const getDefaultValue = (typeDef: any) => {
  if (typeDef.typeName === "ZodOptional") {
    return undefined;
  }
  const typeName = getActualType(typeDef);
  switch (typeName) {
    case "ZodString":
      return "";
    case "ZodBoolean":
      return false;
    case "ZodNumber":
      return 0;
    default:
      return "";
  }
};

const getActualType = (typeDef: any) => {
  if (typeDef.innerType) {
    return typeDef.innerType._def.typeName;
  }
  return typeDef.typeName;
};

export const CreateForm: React.FunctionComponent<Props> = ({
  currentData,
  onCreated,
  schema,
  updateFn,
  createFn,
}) => {
  const fields = Object.keys(schema.shape);

  const fieldTypes = fields.reduce<Record<string, string>>((acc, key) => {
    return {
      ...acc,
      [key]: getActualType(schema.shape[key]._def),
    };
  }, {});

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, key) => {
      return {
        ...acc,
        [key]: get(currentData, key)
          ? get(currentData, key)
          : getDefaultValue(schema.shape[key]._def),
      };
    }, {}),
  });

  const mutation = useMutation({
    mutationFn: (input: CreateOrganizationInput) => {
      if (currentData) {
        return updateFn(currentData.id, input);
      }
      return createFn(input);
    },
  });

  const onSubmit = (data: any) =>
    mutation.mutate(data, {
      onSuccess: async (response) => {
        toast.success(`Data ${currentData ? "updated" : "created"}`);
        onCreated?.(response.data);
      },
      onError: (errors) => {
        console.error(errors);
        toast.error(`Data could not be ${currentData ? "updated" : "created"}`);
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {fields.map((fieldName) => (
        <FormItem key={fieldName}>
          <Label className="capitalize">{fieldName}</Label>
          {fieldTypes[fieldName] === "ZodString" ? (
            <Input type="text" {...register(fieldName as never)} />
          ) : fieldTypes[fieldName] === "ZodBoolean" ? (
            <Controller
              name={fieldName as never}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <Switch
                    id="airplane-mode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
              )}
            />
          ) : fieldTypes[fieldName] === "ZodNumber" ? (
            <Input
              type="number"
              {...register(fieldName as never, {
                setValueAs: (value) => {
                  if (value === "") {
                    return undefined;
                  }
                  return parseInt(value);
                },
              })}
            />
          ) : (
            <></>
          )}
          {get(errors, fieldName) && (
            <p className="text-red-500">
              {get(errors, `${fieldName}.message`)}
            </p>
          )}
        </FormItem>
      ))}

      <Button type="submit" className="w-full" disabled={!isValid}>
        {currentData ? "Update" : "Create"}
      </Button>
    </form>
  );
};
