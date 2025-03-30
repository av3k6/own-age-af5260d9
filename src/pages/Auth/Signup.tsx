
import { useSupabase } from "@/hooks/useSupabase";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Join TransacZen Haven to buy, sell, or provide professional services"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <SignupForm />
    </AuthPageLayout>
  );
};

export default Signup;
