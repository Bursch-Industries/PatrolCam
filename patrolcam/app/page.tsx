import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className = "text-3xl font-bold text-red-500">PAW PATROL</div>
     <Image
              src="/gang.jpg"
              alt="Vercel Logo"
              className="dark:invert"
              width={640}
              height={480}
              priority
            />
    </main>
  );
}
