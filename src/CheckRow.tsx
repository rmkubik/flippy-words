import React from "react";
import styled from "styled-components";
import { palette } from "./palette";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  font-weight: bold;

  button {
    font-weight: bold;
    border: 2px solid ${palette.BLACK};
    box-shadow: 2px 2px ${palette.BLACK};
    background: ${palette.OFF_WHITE};
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
      text-decoration: underline;
    }
  }

  * {
    padding: 0.5rem 1rem;
    border: 2px solid ${palette.BLACK};
    box-shadow: 2px 2px ${palette.BLACK};
    background: ${palette.OFF_WHITE};
  }
`;

const CheckRow = ({ check, count }) => {
  return (
    <Row>
      <div>Check Count: {count}</div>
      <button onClick={check}>Check</button>
    </Row>
  );
};

export default CheckRow;
