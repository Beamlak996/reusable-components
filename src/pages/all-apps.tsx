import z from "zod";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const TestForm = z.object({
  flavors: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, { message: "Please select a name" }),
});

export const AllApps = () => {
  

  const form = useForm<z.infer<typeof TestForm>>({
    resolver: zodResolver(TestForm),
    defaultValues: {
      flavors: [],
    },
  });

  const onSubmit = (values: z.infer<typeof TestForm>) => {
    console.log(values);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="flavors"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flavors</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    isMulti
                    options={options}
                    onChange={(selected) => field.onChange(selected)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <button type="submit" >submit</button>
        </form>
      </Form>
    </div>
  );
};
