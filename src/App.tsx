import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EthiopianDatePicker } from "./components/ethiopian-calendar";
import { Button } from "./components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";

/**
 * Form validation schema using Zod
 */
const formSchema = z.object({
  selectedDate: z.date({
    required_error: "A date is required",
    invalid_type_error: "Please select a valid date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Main App component with form handling
 */
function App() {
  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedDate: undefined,
    },
  });

  /**
   * Handle form submission
   * @param values - The form values
   */
  function onSubmit(values: FormValues) {
    console.log("Form submitted with:", values);
    alert(`Selected date: ${values.selectedDate.toLocaleDateString()}`);
  }

  return (
    <div className="w-full h-full flex items-center justify-center mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[350px]"
        >
          <FormField
            control={form.control}
            name="selectedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select Date</FormLabel>
                <FormControl>
                  <EthiopianDatePicker
                    calendarType="ethiopian"
                    onDateChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  Choose a date in Ethiopian or Gregorian calendar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default App;
