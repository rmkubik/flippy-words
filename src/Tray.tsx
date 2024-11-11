import React from "react";
import { DragItemTypes, PieceData } from "./Piece";
import styled from "styled-components";
import { palette } from "./palette";

const StyledTray = styled.div`
  min-width: 300px;
  min-height: 200px;
  background-color: ${palette.ORANGE};

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Tray = ({ children, movePiece }) => {
  return <StyledTray>{children}</StyledTray>;
};
