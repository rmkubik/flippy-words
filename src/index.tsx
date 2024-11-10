import React from "react";
import { createRoot } from "react-dom/client";
import { Board } from "./Board";
import { Piece, usePieces } from "./Piece";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createGlobalStyle } from "styled-components";
import { palette } from "./palette";

const GlobalStyle = createGlobalStyle`
  body {
    color: ${palette.BLACK};
    background-color: ${palette.PARCHMENT};
  }
`;

const App = () => {
  const { pieces, movePiece } = usePieces();
  return (
    <>
      <GlobalStyle />
      <DndProvider backend={HTML5Backend}>
        <Board movePiece={movePiece}>{pieces}</Board>
      </DndProvider>
    </>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error(`Cannot find root element.`);
const root = createRoot(container);
root.render(<App />);
