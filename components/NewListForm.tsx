"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { nameString } from "@/lib/utils";

const newListFormSchema = z.object({
  name: nameString("List name"),
});

export default function NewListForm() {
  const createList = useMutation(api.lists.createList);
  const form = useForm<z.infer<typeof newListFormSchema>>({
    resolver: zodResolver(newListFormSchema),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(values: z.infer<typeof newListFormSchema>) {
    createList({ name: values.name });
    form.reset();
  }
  return (
    <Card key="new-list" className="h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <CardHeader>
                  <FormControl>
                    <Input
                      className="border-transparent"
                      placeholder="New List"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name of your list. It must be unique.
                  </FormDescription>
                </CardHeader>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
