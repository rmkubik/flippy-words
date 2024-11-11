import React from "react";
import { useDrop } from "react-dnd";
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
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DragItemTypes.PIECE,
    drop: (item: { data: PieceData }) => {
      movePiece(item.data.id, null);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return <StyledTray ref={dropRef}>{children}</StyledTray>;
};
