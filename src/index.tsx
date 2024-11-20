import React from "react";
import { createRoot } from "react-dom/client";
import { Board } from "./Board";
import { Piece, usePieces } from "./Piece";
import { createGlobalStyle } from "styled-components";
import { palette } from "./palette";
import { Tray } from "./Tray";

const GlobalStyle = createGlobalStyle`
  body {
    color: ${palette.BLACK};
    background-color: ${palette.PARCHMENT};
  }
`;

const App = () => {
  const { boardPieces, trayPieces } = usePieces();

  return (
    <>
      <GlobalStyle />
      <Board>{boardPieces}</Board>
      <Tray>{trayPieces}</Tray>
    </>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error(`Cannot find root element.`);
const root = createRoot(container);
root.render(<App />);
