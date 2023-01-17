import { TextField } from "@mui/material";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import type { AST } from "~/lib/query-lang/parser";
import { parse, PeggySyntaxError } from "~/lib/query-lang/parser";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return json({ query, ast: null, results: [] }, 200);
  }

  let ast: AST;

  try {
    ast = parse(query, {
      grammarSource: "./query-lang-parser/grammar.peggy",
    }) as AST;

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

  return json({ query, ast, results: [] }, 200);
};

export default function Index() {
  const data = useLoaderData();

  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const query = searchParams?.get("query")?.trim();

  return (
    <>
      <Form method="get">
        <TextField
          fullWidth
          size="small"
          name="query"
          className=""
          type="text"
          defaultValue={query ?? ""}
          onChange={(e) => submit(e.currentTarget.form)}
          placeholder="(req.status < 299 AND name = vaaa) OR uuid = 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
        />
      </Form>
      {data?.errorMessage && <pre className="">{data.errorMessage}</pre>}
      {data.ast && <pre className="">{JSON.stringify(data.ast, null, 2)}</pre>}
    </>
  );
}
