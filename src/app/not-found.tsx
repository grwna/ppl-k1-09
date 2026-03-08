/**
 * 404 NOT FOUND TEMPLATE
 * Minimalist 404 handler for the whole application.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="text-primary hover:underline font-medium px-4 py-2 border rounded-md"
      >
        Return to Home
      </Link>
    </div>
  );
}
