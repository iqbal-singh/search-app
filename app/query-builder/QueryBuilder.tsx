import { styled } from "@mui/system";
import { Box, Chip, Container } from "@mui/material";

import type {
  FieldOperator,
  ExpressionBinaryOperator,
  AST,
} from "~/lib/query-lang/parser";

const FIELD_OPERATORS: FieldOperator[] = ["=", "!=", ":", "<", ">", "<=", ">="];
const BINARY_OPERATORS: ExpressionBinaryOperator[] = ["AND", "OR"];

type QueryBuilderProps = {
  node: AST | undefined;
};

const ValueChip = styled(Chip)({
  marginRight: 12
});

const ExpressionChip = styled(Chip)({
  marginRight:12
});

function QueryBuilder({ node }: QueryBuilderProps) {
  if (!node) {
    return null;
  }

  if (node.type === "Value") {
    const { value } = node;
    const { term, fieldName, fieldOperator } = value!;
    return (
      <ValueChip
        clickable
        variant="outlined"
        label={
          <>
            {fieldName || ""} <b>{fieldOperator || ""}</b> {term || ""}
          </>
        }
      />
    );
  }

  if (node.type === "Expression") {
    const { leftOperand, rightOperand, operator } = node;
    return (
      <>
        <QueryBuilder node={leftOperand} />
        <ExpressionChip color="primary" variant="filled" label={operator} />
        <QueryBuilder node={rightOperand} />
      </>
    );
  }

  return null;
}

export default QueryBuilder;
