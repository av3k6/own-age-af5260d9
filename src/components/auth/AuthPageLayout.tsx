
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const AuthPageLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthPageLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold text-zen-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-zen-gray-600">{subtitle}</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
          
          {footerText && footerLinkText && footerLinkTo && (
            <div className="mt-6 text-center text-sm">
              <span className="text-zen-gray-600">{footerText}</span>
              <Link to={footerLinkTo} className="ml-1 font-medium text-zen-blue-600 hover:text-zen-blue-500">
                {footerLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
