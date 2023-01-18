import { styled } from "@mui/system";
import { Box, Chip, Typography } from "@mui/material";

import type {
  FieldOperator,
  ExpressionBinaryOperator,
  AST,
} from "~/lib/query-lang/parser";
import { useState } from "react";

const FIELD_OPERATORS: FieldOperator[] = ["=", "!=", ":", "<", ">", "<=", ">="];
const BINARY_OPERATORS: ExpressionBinaryOperator[] = ["AND", "OR"];

type QueryBuilderProps = {
  node?: AST;
  depth?: number;
};

const ValueChip = styled(Chip)({
  padding: 4,
  marginTop: 12,
  marginRight: 12,
});

const ExpressionChip = styled(Chip)({
  padding: 8,
  marginTop: 12,
  marginRight: 12,
});

function QueryBuilder({ node, depth = 0 }: QueryBuilderProps) {
  const [selectedExpression, setSelectedExpression] = useState(-1);

  if (!node) {
    return null;
  }

  if (node.type === "Value") {
    const { value } = node;
    const { term, fieldName, fieldOperator } = value!;
    return (
      <ValueChip
        variant="outlined"
        label={
          <>
            {fieldName && (
              <Typography variant="body2" component="span">
                {fieldName}
              </Typography>
            )}
            {fieldOperator && (
              <Typography
                variant="body2"
                component="span"
                color="primary"
                sx={{ mx: 1, fontWeight: "bold" }}
              >
                {fieldOperator}
              </Typography>
            )}
            {term && (
              <Typography variant="body2" component="span">
                {term}
              </Typography>
            )}
          </>
        }
      />
    );
  }

  if (node.type === "Expression") {
    const { leftOperand, rightOperand, operator } = node;
    
    return (
      <Box
        my={2}
        p={1 + depth}
        border={`1px solid ${selectedExpression === depth ? 'green' : '#ccc'}`}
        borderRadius={1}
      >
        <QueryBuilder node={leftOperand} depth={depth + 1} />
        <ExpressionChip
          color={operator === "AND" ? "primary" : "success"}
          variant="filled"
          label={<Typography variant="body2">{operator}</Typography>}
          clickable
          onMouseOver={(e) => {
            setSelectedExpression(depth);
          }}
          onMouseOut={(e) => {
            setSelectedExpression(-1);
          }}
        />
        <QueryBuilder node={rightOperand} depth={depth + 1} />
      </Box>
    );
  }

  return null;
}

export default QueryBuilder;
