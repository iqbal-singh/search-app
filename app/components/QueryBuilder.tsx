import clsx from "clsx";

import { useEffect, useState } from "react";

import type {
  Query,
  Expression,
  //Field,
  FieldOperator,
  ExpressionBinaryOperator,
  Value,
  //PeggySyntaxError,
} from "~/lib/query-lang/parser";

type QueryBuilderTextInputProps = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

type QueryBuilderOperatorSelectProps<T> = {
  onChange: (value: string) => void;
  defaultValue?: string;
  operators: T[] ;
};

type QueryBuilderFieldInputProps = {
  defaultFieldOperator?: string;
  defaultFieldName?: string;
  defaultTerm?: string;
  onChange: (value: string) => void;
  operators: FieldOperator[];
};

type QueryBuilderButtonProps = {
  text: string;
  variant: "delete" | "add";
  onClick: () => void;
  otherClassName?: string;
};

type QueryBuilderProps = {
  query?: Query | null;
};


const FIELD_OPERATORS: FieldOperator[] = ["=", "!=", ":", "<", ">", "<=", ">="];
const BOOL_OPERATORS: ExpressionBinaryOperator[] = ["AND", "OR"];  


function QueryBuilderTextInput({
  onChange,
  defaultValue = "",
}: QueryBuilderTextInputProps) {
  return (
    <div className="flex">
      <input
        className="w-full rounded-lg border px-4 py-3 shadow-lg focus:outline-sky-600"
        type="text"
        placeholder="adsasd1q234123123 Doe"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        defaultValue={defaultValue}
      />
    </div>
  );
}

function QueryBuilderOperatorSelect({
  onChange,
  defaultValue = "",
  operators = [],
}: QueryBuilderOperatorSelectProps<FieldOperator | ExpressionBinaryOperator>) {
  return (
    <select
      className="w-fit appearance-none rounded-lg border px-6 py-3 font-bold  shadow-lg hover:bg-slate-200 focus:outline-sky-600"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      defaultValue={defaultValue}
    >
      {operators.map((value) => (
        <option className="px-4 py-3" key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

function QueryBuilderFieldInput({
  defaultFieldName,
  defaultFieldOperator,
  defaultTerm,
  onChange,
  operators = [],
}: QueryBuilderFieldInputProps) {
  const [fieldName, setFieldName] = useState(defaultFieldName || "");
  const [operator, setOperator] = useState(defaultFieldOperator);
  const [fieldValue, setFieldValue] = useState(defaultTerm);

  useEffect(() => {
    if (!fieldName || !operator || !fieldValue) {
      return;
    }

    onChange(`(${fieldName.trim()}${operator}${fieldValue.trim()})`);
  }, [fieldName, fieldValue, onChange, operator]);

  return (
    <div className="flex gap-2">
      <input
        className="w-full rounded-lg border px-4 py-3 shadow-lg focus:outline-sky-600"
        type="text"
        placeholder="req.status"
        onChange={(e) => {
          setFieldName(e.target.value);
        }}
        value={fieldName}
      />
      <QueryBuilderOperatorSelect
        defaultValue={defaultFieldOperator}
        operators={operators}
        onChange={(op) => {
          setOperator(op);
        }}
      />
      <input
        className="w-full rounded-lg border px-4 py-3  shadow-lg focus:outline-sky-600"
        type="text"
        placeholder="200"
        onChange={(e) => {
          setFieldValue(e.target.value);
        }}
        value={fieldValue}
      />
    </div>
  );
}

function QueryBuilderButton({
  text,
  onClick,
  otherClassName,
  variant,
}: QueryBuilderButtonProps) {
  return (
    <button
      className={clsx(
        "w-fit rounded-lg border px-8 py-2 caret-blue-500 shadow-lg focus:outline-sky-600",
        variant === "delete" ? "hover:bg-red-100" : "hover:bg-green-100",
        otherClassName
      )}
      onClick={() => onClick()}
    >
      {text}
    </button>
  );
}

function QueryForm({ node }: { node: Query | null | undefined }) {
  if (!node) {
    return null;
  }

  let index = 0;
  const key = () => {
    return Math.floor(Math.random() * Number.MAX_VALUE) + ++index + "";
  };

  switch (node.type) {
    case "Value": {
      const { fieldName, fieldOperator, term } = node.value as Value;
      if (fieldName && fieldOperator) {
        return (
          <QueryBuilderFieldInput
            defaultFieldName={fieldName}
            defaultFieldOperator={fieldOperator}
            defaultTerm={term}
            operators={FIELD_OPERATORS}
            onChange={() => {}}
            key={key()}
          />
        );
      } else {
        return (
          <QueryBuilderTextInput
            key={key()}
            defaultValue={term}
            onChange={() => {}}
          />
        );
      }
    }
    case "Expression": {
      const { leftOperand, rightOperand, operator } = node as Expression;
      return (
        <>
          <QueryForm node={leftOperand} />
          <QueryBuilderOperatorSelect
            key={key()}
            operators={BOOL_OPERATORS}
            defaultValue={operator}
            onChange={() => {}}
          />
          <QueryForm node={rightOperand} />
        </>
      );
    }

    default: {
      return null;
    }
  }
}

function QueryBuilder(props: QueryBuilderProps) {
  const { query } = props;
  return (
    <div className="mx-auto mt-12 grid grid-cols-2 gap-4 rounded-lg bg-gray-100 py-4 px-4 md:w-full lg:w-8/12">
      <QueryForm node={query} />
      <QueryBuilderButton variant="add" text="➕" onClick={() => {}} />
    </div>
  );
}

export default QueryBuilder;
