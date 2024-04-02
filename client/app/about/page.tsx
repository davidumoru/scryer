/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col justify-between lg:p-24 lg:items-center">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
      <div className="flex flex-row justify-center">
        <div className="max-w-[50rem] pt-32">
          <div className="flex flex-col space-y-4">
            <div className="space-y-6">
              <h1 className="font-bold tracking-tighter text-4xl md:text-6xl lg:text-7xl">
                Unleashing Web Data Insights with Gemini
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                We are a passionate team at the forefront of data exploration,
                fueled by the power of artificial intelligence. Our mission is
                to empower anyone to unlock valuable insights from the vast
                ocean of web data.
              </p>
            </div>
          </div>
        </div>
        <Image
          src="/online-world.svg"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </div>

      <div className="flex flex-row justify-center">
        <Image
          src="/data-extraction.svg"
          width={500}
          height={500}
          alt="Picture of the author"
        />
        <div className="max-w-[50rem] pt-32">
          <div className="flex flex-col space-y-4">
            <div className="space-y-6">
              <h1 className="font-bold tracking-tighter text-4xl md:text-6xl lg:text-7xl">
                Introducing the Gemini & Web Scraping Powerhouse
              </h1>
              <p className="font-bold max-w-[700px] text-gray-300 md:text-2xl">
                This hackathon project brings together two innovative forces:
              </p>
              <ul className="list-disc pl-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                <li>
                  <span className="font-bold text-gray-300">Gemini: </span>A
                  powerful large language model with natural language processing
                  (NLP) expertise. Gemini can sift through text data, identify
                  patterns, and extract meaning with exceptional accuracy.
                </li>
                <li>
                  <span className="font-bold text-gray-300">
                    Web Scraping Methods:{" "}
                  </span>
                  Techniques to gather targeted data from websites. This data
                  can be anything from product information to social media
                  trends.{" "}
                  <p className="max-w-[700px] text-gray-300 md:text-xl dark:text-gray-300">
                    By combining these forces, we've created a user-friendly
                    tool that simplifies complex data tasks.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center pt-24">
        <div className="max-w-[50rem] pt-32">
          <div className="flex flex-col space-y-4">
            <div className="space-y-6">
              <h1 className="font-bold tracking-tighter text-2xl md:text-3xl lg:text-4xl">
                Here's What We Offer:
              </h1>
              <ul className="list-disc pl-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                <li>
                  <span className="font-bold text-gray-300">
                    Effortless Data Extraction:{" "}
                  </span>
                  Forget manual data collection. Our system automates the
                  process, saving you time and ensuring accuracy.
                </li>
                <li>
                  <span className="font-bold text-gray-300">
                    In-depth Data Analysis:{" "}
                  </span>
                  Gemini goes beyond basic data collection. It analyzes the
                  extracted information, revealing hidden patterns and trends.
                </li>
                <li>
                  <span className="font-bold text-gray-300">
                    Clear and Concise Insights:{" "}
                  </span>
                  No more drowning in data. We present the findings in an
                  easy-to-understand format, empowering you to make data-driven
                  decisions.
                </li>
                <li>
                  <span className="font-bold text-gray-300">
                    Actionable Results:{" "}
                  </span>
                  Our goal is to equip you with the insights you need to take
                  concrete actions and achieve your goals.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Image
          src="/analysis-amico.svg"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </div>

      <div className="font-bold text-gray-300 max-w-[700px] md:text-2xl mt-32 text-center">
        <p>Join us on this data exploration journey!</p>
        <p>Let's turn web data into actionable knowledge. Together.</p>
      </div>
    </main>
  );
}
