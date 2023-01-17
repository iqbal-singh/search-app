import { useEffect, useState } from "react";

import type {
  FieldOperator,
  ExpressionBinaryOperator,
} from "~/lib/query-lang/parser";


const FIELD_OPERATORS: FieldOperator[] = ["=", "!=", ":", "<", ">", "<=", ">="];
const BOOL_OPERATORS: ExpressionBinaryOperator[] = ["AND", "OR"];  


function QueryBuilder() {
    
    return (
      <div>
     
      </div>
    );
  }
  
  export default QueryBuilder;