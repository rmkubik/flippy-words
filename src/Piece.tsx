import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { gridGap, tilesHigh, tileSize, tilesWide } from "./Board";
import { palette } from "./palette";
import { v4 as uuid } from "uuid";
import { update } from "./arrays";
import Draggable from "react-draggable";
import { clamp } from "./numbers";

export const pieceInnerMargin = 4;

export const DragItemTypes = {
  PIECE: "piece",
};

const StyledPiece = styled.div<{
  $tilesWide;
  $tilesHigh;
  $row;
  $col;
  $rotation;
}>`
  width: ${(props) =>
    props.$tilesWide * tileSize +
    (props.$tilesWide - 1) * gridGap -
    pieceInnerMargin * 2}px;
  height: ${(props) =>
    props.$tilesHigh * tileSize +
    (props.$tilesHigh - 1) * gridGap -
    pieceInnerMargin * 2}px;

  background-color: ${palette.OFF_WHITE};
  grid-column: span ${(props) => props.$tilesWide};
  grid-row: span ${(props) => props.$tilesHigh};
  // +1 here because these properties are 1 indexed
  grid-row-start: ${(props) => props.$row + 1};
  grid-column-start: ${(props) => props.$col + 1};

  position: relative;
  pointer-events: all;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;

  transform-origin: center;
  transform: rotate(${(props) => props.$rotation}deg); // translate(-50%);

  margin: ${pieceInnerMargin}px;

  /**
   * This style applies to the dragged element.
   */
  &:active {
    cursor: grab;
    transform: rotate(${(props) => props.$rotation}deg);
  }
`;

export const Piece = ({ children, data, movePiece }) => {
  const [isAnyPieceDragging, setIsAnyPieceDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const isDragging = false;

  return (
    <Draggable
      onStop={(event, { x, y }) => {
        const row = Math.floor((x + pieceInnerMargin) / tileSize);
        const col = Math.floor((y + pieceInnerMargin) / tileSize);

        movePiece(data.id, {
          row: clamp(row, 0, tilesHigh),
          col: clamp(col, 0, tilesWide),
        });
      }}
      position={{
        x: data.location.row * tileSize,
        y: data.location.col * tileSize,
      }}
    >
      <div style={{ position: "absolute" }}>
        <StyledPiece
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: isDragging ? "grabbing" : "grab",
            /**
             * Prevent any pieces from blocking drop events. ReactDND
             * doesn't seem to have a built in way to support this so
             * we hacked it in.
             */
            pointerEvents:
              isAnyPieceDragging && !isDragging ? "none" : undefined,
          }}
          $tilesWide={data.dimensions.width}
          $tilesHigh={data.dimensions.height}
          $row={data.location?.row ?? 0}
          $col={data.location?.col ?? 0}
          $rotation={rotation}
          onDoubleClick={() => {
            setRotation((rotation + 90) % 360);
          }}
        >
          {children}
        </StyledPiece>
      </div>
    </Draggable>
  );
};

const Top = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Left = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
`;

const Right = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) rotate(270deg);
`;

Piece.Top = Top;
Piece.Bottom = Bottom;
Piece.Left = Left;
Piece.Right = Right;

export type PieceData = {
  id: string;
  location: {
    row: number;
    col: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  words: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
};

const startingPieces = [
  {
    id: uuid(),
    location: {
      row: 0,
      col: 0,
    },
    dimensions: {
      width: 2,
      height: 2,
    },
    words: {
      top: "top",
      bottom: "bottom",
      right: "right",
      left: "left",
    },
  },
  {
    id: uuid(),
    location: {
      row: 2,
      col: 2,
    },
    dimensions: {
      width: 1,
      height: 2,
    },
    words: {
      top: "top",
      bottom: "bottom",
      right: "right",
      left: "left",
    },
  },
];

export const usePieces = () => {
  const [piecesData, setPiecesData] = useState<PieceData[]>(
    () => startingPieces
  );

  const movePiece = (pieceId, newLocation) => {
    setPiecesData((prevData) => {
      const pieceDataIndex = prevData.findIndex((data) => data.id === pieceId);

      console.log({ pieceId, newLocation });

      if (pieceDataIndex === -1)
        throw new Error(`Piece doesn't have data. ${pieceId}`);

      const newData = update(prevData, pieceDataIndex, {
        ...prevData[pieceDataIndex],
        location: newLocation,
      });

      return newData;
    });
  };

  const { boardPieces, trayPieces } = useMemo(() => {
    const boardPieces = piecesData
      .filter((data) => data.location !== null)
      .map((data) => {
        return (
          <Piece key={data.id} data={data} movePiece={movePiece}>
            <Piece.Top>{data.words.top}</Piece.Top>
            <Piece.Bottom>{data.words.bottom}</Piece.Bottom>
            <Piece.Left>{data.words.left}</Piece.Left>
            <Piece.Right>{data.words.right}</Piece.Right>
          </Piece>
        );
      });
    const trayPieces = piecesData
      .filter((data) => data.location === null)
      .map((data) => {
        return (
          <Piece key={data.id} data={data} movePiece={movePiece}>
            <Piece.Top>{data.words.top}</Piece.Top>
            <Piece.Bottom>{data.words.bottom}</Piece.Bottom>
            <Piece.Left>{data.words.left}</Piece.Left>
            <Piece.Right>{data.words.right}</Piece.Right>
          </Piece>
        );
      });

    return { boardPieces, trayPieces };
  }, [piecesData]);

  return { boardPieces, trayPieces, movePiece };
};
