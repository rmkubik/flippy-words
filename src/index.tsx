import React from "react";
import { createRoot } from "react-dom/client";
import { Board } from "./Board";
import { Piece, usePieces } from "./Piece";
import styled, { createGlobalStyle } from "styled-components";
import { palette } from "./palette";
import { Tray } from "./Tray";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  height: 100vh;
  width: 100vw;
  padding: 64px;
`;

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
      <Container>
        <Board>{boardPieces}</Board>
      </Container>
      {/* <Tray>{trayPieces}</Tray> */}
    </>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error(`Cannot find root element.`);
const root = createRoot(container);
root.render(<App />);
