import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const newSublistFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Sublist name must be at least two characters." })
    .max(50, { message: "Sublist name must be at most 50 characters." }),
});

export default function NewSublistForm() {
  const createSublist = useMutation(api.sublist.createSublist);
  const form = useForm<z.infer<typeof newSublistFormSchema>>({
    resolver: zodResolver(newSublistFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof newSublistFormSchema>) {
    createSublist({ name: values.name });
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
              <FormLabel>New Sublist</FormLabel>
              <FormControl>
                <Input placeholder="New sublist" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your sublist. It must be unique.
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
