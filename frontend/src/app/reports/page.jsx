'use client';
import { useEffect, useState } from 'react';
import API from '@/lib/api';
import Link from 'next/link';

export default function ReportsPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    API.get('/files')
      .then((res) => setFiles(res.data))
      .catch(console.error);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f._id}>
            <Link href={`/report/${f._id}`} className="text-blue-600 underline">
              {f.filename}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
