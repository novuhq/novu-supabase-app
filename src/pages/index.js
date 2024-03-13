import Image from "next/image";
import { Inter } from "next/font/google";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllInvestors();
  }, []);

  async function fetchAllInvestors() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("investors").select("*");

      if (error) throw error;
      setInvestors(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addInvestor(
    email_reach,
    name,
    website,
    funding_amount,
    funding_type
  ) {
    try {
      const { data, error } = await supabase
        .from("investors")
        .insert([
          {
            email_reach,
            name,
            website,
            funding_amount,
            funding_type,
          },
        ])
        .single();
      if (error) throw error;
      alert("Investor added successfully");
      fetchAllInvestors();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const email_reach = e.target.email_reach.value;
    const name = e.target.name.value;
    const website = e.target.website.value;
    const funding_amount = e.target.funding_amount.value;
    const funding_type = e.target.funding_type.value;
    const userID = process.env.NEXT_PUBLIC_SUBSCRIBER_ID;

    addInvestor(email_reach, name, website, funding_amount, funding_type);
    //triggerNotification(userID, handle, name);
  }

  async function triggerNotification(userID, handle, name) {
    await fetch("/api/send-notification", {
      method: "POST",
      body: JSON.stringify({
        subscriberID: userID,
        userHandle: handle,
        username: name,
      }),
    });
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          NOVU SUPABASE DASHBOARD
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div className="mt-1 flex justify-center">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="p-3 block">Name:</label>
              <input
                className="text-black p-2"
                type="text"
                name="name"
                required
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="p-3 block">Email Reach:</label>
              <input
                className="text-black p-2"
                type="text"
                name="email_reach"
                required
                placeholder="Enter investor email"
              />
            </div>
            <div className="mt-5">
              <label className="p-2 block">Website:</label>
              <input
                className="text-black p-2"
                type="text"
                name="website"
                required
                placeholder="Enter website"
              />
            </div>
            <div className="mt-5">
              <label className="p-2 block">Funding Amount (Up to X USD):</label>
              <input
                className="text-black p-2"
                type="text"
                name="funding_amount"
                required
                placeholder="Enter funding amount"
              />
            </div>
            <div className="mt-5">
              <label className="p-2 block">Funding Type:</label>
              <input
                className="text-black p-2"
                type="text"
                name="funding_type"
                required
                placeholder="Enter type of Funding"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 p-2 rounded-md mt-5 px-12"
            >
              Submit Investor Details
            </button>
          </form>
        </div>

        <div className="mt-1 flex justify-center">
          {investors?.length === 0 ? (
            <div>
              <p>There are no investors yet</p>
            </div>
          ) : (
            <div>
              <p className="mb-5">Here are the investors available: </p>
              <table>
                <thead>
                  <tr>
                    <th>Name </th>
                    <th>Email Reach</th>
                    <th>Website</th>
                    <th className="p-3">Funding Amt</th>
                    <th>Funding Type </th>
                  </tr>
                </thead>
                <tbody className="">
                  {investors?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.email_reach}</td>
                      <td>{item.website}</td>
                      <td>{item.funding_amount}</td>
                      <td>{item.funding_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
