
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";
import RoleSelector from "./RoleSelector";
import SocialLoginButtons from "./SocialLoginButtons";
import { useSignupForm } from "@/hooks/useSignupForm";

const SignupForm = () => {
  const { form, isLoading, handleSubmit } = useSignupForm();

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput 
                    id="password"
                    value={field.value}
                    onChange={field.onChange}
                    autoComplete="new-password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput 
                    id="confirmPassword"
                    value={field.value}
                    onChange={field.onChange}
                    autoComplete="new-password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <RoleSelector control={form.control} />

          <TermsCheckbox control={form.control} />

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zen-blue-500 hover:bg-zen-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>

      <SocialLoginButtons />
    </>
  );
};

export default SignupForm;
