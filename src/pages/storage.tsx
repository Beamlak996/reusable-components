import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const TestForm = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const Stroage = () => {
  const form = useForm<z.infer<typeof TestForm>>({
    resolver: zodResolver(TestForm),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof TestForm>) => {
    console.log(values)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input {...field} placeholder="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" >Click</button>
        </form>
      </Form>
    </div>
  );
};
