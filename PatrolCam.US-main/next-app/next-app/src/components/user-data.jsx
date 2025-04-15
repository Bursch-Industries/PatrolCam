// components/user-data.jsx
'use client';
import useSWR from 'swr';
import 'isomorphic-fetch'; // Polyfill for fetch in Node.js
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetcher = async (...args) => {
    const res = await fetch(...args);
    if (!res.ok) {
      const error = new Error('Failed to fetch');
      error.status = res.status;
      throw error;
    }
    return res.json();
  };

export function UserData() {
  const { data, error, isLoading } = useSWR('/api/user-data', fetcher);

  if (error) return (
    <Card className="w-[350px]">
      <CardContent className="p-4 text-red-500">
        Error
      </CardContent>
    </Card>
  );

  if (isLoading) return (
    <Card className="w-[350px]">
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[220px]" />
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Name:</span> {data.firstname}
        </p>
        <p className="text-sm">
          <span className="font-medium">Lastname:</span> {data.lastname}
        </p>
        <p className="text-sm">
          <span className="font-medium">Role:</span> {data.role}
        </p>
      </CardContent>
    </Card>
  );
}