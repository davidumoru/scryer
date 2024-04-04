/* eslint-disable react/no-unescaped-entities */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Features() {
  return (
    <main className="flex min-h-screen flex-col justify-between lg:p-24 lg:items-center">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
      <div className="grid gap-10 px-8 py-28 md:grid-cols-2 md:gap-20">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Targeted Extraction</CardTitle>
              <CardDescription>
                Pinpoint What Matters: Extract Specific Data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              Don't settle for everything, get exactly what you need. Gemini
              refines the raw data scraped from websites based on your criteria.
              Focus on extracting product descriptions, prices, reviews, or
              other details you require. Explore how Gemini streamlines your
              data collection.
            </CardContent>
            <CardFooter>
              <Button className="w-full">Try it Now</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Data Analysis & Insights
              </CardTitle>
              <CardDescription>
                Uncover Hidden Gems: Analyze & Identify Trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              Go beyond the surface level. Gemini dives deep into your scraped
              data, using NLP to identify patterns and trends you might miss.
              Gain valuable insights for market research, price comparisons, or
              sentiment analysis of online reviews. Explore how Gemini unlocks
              hidden knowledge within your data.
            </CardContent>
            <CardFooter>
              <Button className="w-full">Try it Now</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Data Summarization & Reporting
              </CardTitle>
              <CardDescription>
                Cut Through the Clutter: Clear & Concise Summaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              Don't get lost in a sea of information. Gemini transforms large,
              complex datasets into clear and concise reports. Focus on the key
              findings and actionable insights, without getting bogged down by
              technical jargon. Explore how Gemini simplifies your data
              understanding.
            </CardContent>
            <CardFooter>
              <Button className="w-full">Try it Now</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Filtering & Refinement</CardTitle>
              <CardDescription>
                Sharpen Your Focus: Filter & Refine Your Data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              Sometimes, less is more. If your initial scrape gathers too much
              data, Gemini refines it based on your specific criteria. Save time
              and ensure you're only working with the most relevant information
              for your needs. Explore how Gemini helps you focus on what matters
              most.
            </CardContent>
            <CardFooter>
              <Button className="w-full">Try it Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
