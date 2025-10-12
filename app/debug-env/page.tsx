// This page should be removed after debugging - don't leave it in production!

import Link from "next/link";

export default function DebugEnv() {
  // This runs on the server side
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
    MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
    VERCEL: process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL,
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Debug Page</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm overflow-x-auto">
          {JSON.stringify(envCheck, null, 2)}
        </pre>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions:</h2>
        <div className="space-y-2">
          <Link
            href="/api/auth/signin"
            className="block w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Sign In
          </Link>
          <Link
            href="/api/auth/providers"
            className="block w-fit px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Check Providers
          </Link>
        </div>
      </div>

      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          ⚠️ Remember to remove this debug page before going to production!
        </p>
      </div>
    </div>
  );
}
