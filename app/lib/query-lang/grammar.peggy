{{

// --------------------------------
// Types
// --------------------------------

/**
 * Specifies the relationship between two expressions
 */
export type ExpressionBinaryOperator = "AND" | "OR";

/**
 * Specifies comparison operation between a field and a value.
 */
export type FieldOperator = ":" | "<=" | ">=" | "=" | "!=" | "<" | ">";


/**
 * Specifies the field to search in. It can contain a fieldName and fieldOperator. 
 * if not provided it means field/value combination is not specified.
 */
export type Field = {
  fieldName: string | null;
  fieldOperator: FieldOperator | null;
};

/**
 * Represents a single term or a field/value combination to search for.
 * It contains the field/value combination and the term being searched for.
 */
export type Value = Field & {
  type: "Value";
  term: string;
};

/**
 * Represents a combination of two values or expressions with a binary operator.
 */
export type Expression = {
  type: "Expression";
  leftOperand?: Value;
  rightOperand?: Value;
  value?: Value;
  operator?: ExpressionBinaryOperator;
};

/**
 * Represents the parsed input query.
 */
export type Query = {
  type: "Value" | "Expression";
  leftOperand?: Query;
  rightOperand?: Query;
  value?: Value;
  operator?: ExpressionBinaryOperator;
};


// --------------------------------
const reduceFn = (acc: Query, item: unknown): Query => {
  const [_, operator, __, b] = item as [any, ExpressionBinaryOperator, any, Query];
  return { type: "Expression", leftOperand: acc, rightOperand: b, operator };
};
// --------------------------------

}}

// --------------------------------
// Grammar Rules
// --------------------------------
Query "Query"
  = _ head:Expression tail:(_ ExpressionBinaryOperator _ Expression)* _ {
      return tail.reduce(reduceFn, head);
  } / _ 

Expression "Expression"
  = OpenParen _ q:Query _ CloseParen { return q; }
  / _ v:Value _ { return { type:'Value', value:v }; }

Value "Value"
  = _ field:Field? Quote value:([^"\\] / Backslash .)+ Quote { 
      return { type:'Value', fieldName:field?.fieldName || null, fieldOperator:field?.fieldOperator || null, term: value.flat().join('').replaceAll('\\\\','') };
  } 
  / _ field:Field? value:[^ ()]* _ { 
      return { type:'Value', fieldName:field?.fieldName || null, fieldOperator:field?.fieldOperator || null, term: value.join('') };
  }

Field "Field"
  = fieldName:[a-zA-Z0-9-._\[\]]i* _ fieldOperator:FieldOperator _ { 
    return { fieldName: fieldName.join(''), fieldOperator }; 
  }

FieldOperator "FieldOperator"
 = _ op:(":" / "<=" / ">=" / "=" / "!=" /  "<" / ">" ) _ {
  return op;
 }

ExpressionBinaryOperator "ExpressionBinaryOperator" 
 = _ op:("AND" / "OR" ) _ { 
   return op;
 }

Backslash "Backslash"
  = "\\\\" 
  
OpenParen "OpenParen"
 = "("

CloseParen "CloseParen"
 = ")"

Quote "Quote"
 = "\""

_ "whitespace"
  = [ \t\n\r]* { return ''; }