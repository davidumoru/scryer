import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Features() {
  return (
    <main className="flex min-h-screen flex-col justify-between lg:p-24 lg:items-center">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
      <div className="mx-auto p-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl lg:text-4xl">
              Unleash Web Data Insights
            </CardTitle>
            <CardDescription className="text-base lg:text-lg">
              Enter the url of the website you wish to explore. Ensure you enter
              the full url (including https://)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input id="url" placeholder="https://example.com/" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Link href="dashboard/extract">Try it Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div></div>
    </main>
  );
}
