"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import axios from "axios";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "./Loading";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleUrlSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5006/generate", {
        url,
      });

      console.log("Url Submitted. Scraping...:", response.data);
      toast.success(response.data.message);
      router.push("/dashboard/result", response.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleUrlSubmit}>
              <div className="space-y-2">
                <Label htmlFor="url"></Label>
                <Input
                  id="url"
                  placeholder="https://www.example.com/"
                  required
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="mt-6">
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Scrapping..." : "Try it now"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {isLoading && <Loading />}
      <div></div>
      <ToastContainer />
    </main>
  );
}
