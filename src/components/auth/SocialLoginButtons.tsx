
import { Button } from "@/components/ui/button";
import { useSocialAuth } from "@/hooks/useSocialAuth";

interface SocialLoginButtonsProps {
  onGoogleSignIn?: () => Promise<void>;
  onFacebookSignIn?: () => Promise<void>;
  isLoading?: boolean;
}

const SocialLoginButtons = ({
  onGoogleSignIn,
  onFacebookSignIn,
  isLoading: externalIsLoading,
}: SocialLoginButtonsProps = {}) => {
  const { isLoading: localIsLoading, handleSocialSignIn } = useSocialAuth();
  
  // Use external handlers if provided
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : localIsLoading;
  const handleGoogleSignIn = onGoogleSignIn || (() => handleSocialSignIn("google"));
  const handleFacebookSignIn = onFacebookSignIn || (() => handleSocialSignIn("facebook"));
  
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-zen-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <Button
            variant="outline"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-zen-gray-500 hover:bg-gray-50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <span className="sr-only">Sign in with Google</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-zen-gray-500 hover:bg-gray-50"
            onClick={handleFacebookSignIn}
            disabled={isLoading}
          >
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
