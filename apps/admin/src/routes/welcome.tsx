import { createFileRoute } from "@tanstack/react-router";
import { LogoFull } from "../components/LogoFull";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "@/lib/query";
import {
  executeInitialDatabaseMigration,
  getSystemDatabaseMigrations,
} from "@/api";
import { SignUpForm } from "@/components/SignUpForm";

const Welcome: React.FunctionComponent = () => {
  const {
    data: { data: databaseMigrations = [] },
    refetch,
  } = useSuspenseQuery(buildQueryOptions(getSystemDatabaseMigrations));

  const mutation = useMutation({
    mutationFn: executeInitialDatabaseMigration,
    onSuccess: () => {
      refetch();
    },
  });
  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <LogoFull />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Thank you for giving Publiz a try. We are excited to have you on.
          </CardDescription>
        </CardHeader>
        {databaseMigrations.length > 0 ? (
          <CardContent>
            <SignUpForm />
          </CardContent>
        ) : (
          <CardFooter>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              Get started
              {mutation.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});
