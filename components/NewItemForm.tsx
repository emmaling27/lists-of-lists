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
import { Id } from "@/convex/_generated/dataModel";
import { nameString } from "@/lib/utils";

const newItemFormSchema = z.object({
  name: nameString("Item name"),
});

export default function NewItemForm({ listId }: { listId: Id<"lists"> }) {
  const addItemToList = useMutation(api.list.addItemToList);
  const form = useForm<z.infer<typeof newItemFormSchema>>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(values: z.infer<typeof newItemFormSchema>) {
    addItemToList({ name: values.name, listId });
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
                <Input placeholder="New item" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your item. It must be unique.
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
