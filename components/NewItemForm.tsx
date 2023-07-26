"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
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

export function NewItemFormForList({ listId }: { listId: Id<"lists"> }) {
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
  return <NewItemForm onSubmit={onSubmit} form={form} />;
}

export function NewItemFormForSublist({
  sublistId,
}: {
  sublistId: Id<"sublists">;
}) {
  const addItemToSublist = useMutation(api.sublist.addItemToSublist);

  const form = useForm<z.infer<typeof newItemFormSchema>>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(values: z.infer<typeof newItemFormSchema>) {
    addItemToSublist({ itemName: values.name, sublistId });
    form.reset();
  }
  return <NewItemForm onSubmit={onSubmit} form={form} />;
}

function NewItemForm({
  onSubmit,
  form,
}: {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof newItemFormSchema>) => void;
  form: UseFormReturn<z.infer<typeof newItemFormSchema>>;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Name</FormLabel>
              <FormControl>
                <Input placeholder="New item" {...field} />
              </FormControl>
              <FormDescription className="hidden">
                Name of your item
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
