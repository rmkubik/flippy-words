import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Board } from "./Board";
import { Piece, usePieces } from "./Piece";
import styled, { createGlobalStyle } from "styled-components";
import { palette } from "./palette";
import CheckRow from "./CheckRow";
import { PieceData, solutionPieces } from "./data";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  height: 100vh;
  width: 100vw;
  padding: 64px;
  box-sizing: border-box;
`;

const GlobalStyle = createGlobalStyle`
  body {
    color: ${palette.BLACK};
    background-color: ${palette.PARCHMENT};
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
  }
`;

const App = () => {
  const { boardPieces, checkCount, check } = usePieces();

  return (
    <>
      <GlobalStyle />
      <Container>
        <div>
          <CheckRow count={checkCount} check={check} />
          <Board>{boardPieces}</Board>
        </div>
      </Container>
    </>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error(`Cannot find root element.`);
const root = createRoot(container);
root.render(<App />);
