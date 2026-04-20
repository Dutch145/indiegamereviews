import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-4xl font-semibold mb-3">404</h1>
      <p className="text-gray-400 mb-6">Page not found.</p>
      <Link href="/" className="text-indigo-600 hover:underline text-sm">
        Back to home
      </Link>
    </div>
  );
}
