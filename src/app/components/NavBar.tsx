import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-white shadow mb-4">
      <div className="container mx-auto p-4 flex justify-between">
        <Link className="text-xl font-bold" href="/">Blockchain Dashboard</Link>
        {/* Add navigation links if needed */}
      </div>
    </nav>
  );
}
