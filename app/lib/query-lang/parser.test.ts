
//TODO
import { parse } from "./parser";
import type { ParserResult } from "./parser";

const query =
  '123 OR vb < 412 AND x = 23123 AND v = 23 OR v = "asdasdsa asdasd \\" asd"';


const expectedResult: ParserResult = {
  type: "Expression",
  leftOperand: {
    type: "Expression",
    leftOperand: {
      type: "Expression",
      leftOperand: {
        type: "Expression",
        leftOperand: {
          type: "Value",
          value: {
            type: "Value",
            fieldName: null,
            fieldOperator: null,
            term: "123",
          },
        },
        rightOperand: {
          type: "Value",
          value: {
            type: "Value",
            fieldName: "vb",
            fieldOperator: "<",
            term: "412",
          },
        },
        operator: "OR",
      },
      rightOperand: {
        type: "Value",
        value: {
          type: "Value",
          fieldName: "x",
          fieldOperator: "=",
          term: "23123",
        },
      },
      operator: "AND",
    },
    rightOperand: {
      type: "Value",
      value: {
        type: "Value",
        fieldName: "v",
        fieldOperator: "=",
        term: "23",
      },
    },
    operator: "AND",
  },
  rightOperand: {
    type: "Value",
    value: {
      type: "Value",
      fieldName: "v",
      fieldOperator: "=",
      term: 'asdasdsa asdasd " asd',
    },
  },
  operator: "OR",
};


console.log(JSON.stringify(parse(query)) === JSON.stringify(expectedResult));