import { Form, useSubmit, useSearchParams } from "@remix-run/react";

export default function SearchInputField() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const query = searchParams?.get("query")?.trim();

  return (
    <Form method="get">
      <input
        name="query"
        className="w-full rounded-lg border px-4 py-3 caret-blue-500 shadow-lg focus:outline-sky-600"
        type="text"
        defaultValue={query ?? ""}
        onChange={(e) => submit(e.currentTarget.form)}
        placeholder="(req.status < 299 AND name = vaaa) OR uuid = 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
      />
    </Form>
  );
}
