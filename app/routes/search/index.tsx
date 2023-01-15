
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import type { Query } from "~/lib/query-lang/parser";

import { parse,  PeggySyntaxError } from "~/lib/query-lang/parser";

import SearchInputField from "~/components/SearchInputField";
import QueryBuilder from "~/components/QueryBuilder";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ query, ast: null, results: [] }, 200);
  }

  let ast: Query | null;

  try {

    ast = parse(query, {
      grammarSource: "./query-lang-parser/grammar.peggy",
    });

    
    // search here
    // transform ast

  } catch (e: unknown) {
    let errorMessage = "";

    if (e instanceof PeggySyntaxError) {
      errorMessage = e.format([

        { grammarSource: "./query-lang-parser/grammar.peggy", text: query },
      ]);
    } else if (e instanceof Error) {
      errorMessage = e.message;
    } else {
      errorMessage = "Unable to process query.";
    }
    return json({ query, ast: null, results: [], errorMessage }, 400);
  }

  // return json({}, 500);

  return json({ query, ast , results: [] }, 200);
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div className="m-2  bg-white p-2">
      <div className="">
        <SearchInputField />
      </div>

      {data?.errorMessage && (
        <pre className="my-3 overflow-auto rounded-lg bg-red-200 p-2 text-xs">
          {data?.errorMessage}
        </pre>
      )}

      <div className="my-3">
        <QueryBuilder query={data?.ast ?? {}} />
      </div>
    </div>
  );
}
