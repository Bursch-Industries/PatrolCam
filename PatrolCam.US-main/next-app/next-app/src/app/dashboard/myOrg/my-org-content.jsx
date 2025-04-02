// src/components/my-org-content.jsx
'use client';

import { Button } from "@/components/ui/button";

export function SaveButton() {
  return (
    <div>
      <Button onClick={() => console.log('Clicked')}>Click me</Button>
    </div>
  );
}