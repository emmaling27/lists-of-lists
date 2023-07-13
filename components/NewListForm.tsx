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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const newListFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "List name must be at least two characters." })
    .max(50, { message: "List name must be at most 50 characters." }),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="New List" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your list. It must be unique.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
