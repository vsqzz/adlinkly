import { Nav } from "@/components/nav";

const sample = `POST /api/v1/links
Authorization: Bearer adl_live_xxx

{
  "destinationUrl": "https://example.com/file",
  "title": "Asset pack",
  "monetization": "standard"
}`;

export default function ApiDocsPage() {
  return (
    <>
      <Nav />
      <main className="shell py-10">
        <h1 className="text-4xl font-black">Script and API access</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The API lets approved creators create links, read analytics, rotate API keys, and fetch payout state. Production access should require Creator Pro and fraud review.
        </p>
        <pre className="mt-8 overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm text-slate-100">{sample}</pre>
      </main>
    </>
  );
}
