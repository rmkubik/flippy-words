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

function isHorizontal(degrees) {
  return degrees === 90 || degrees === 270;
}

function calcTransformOrigin(data: PieceData) {
  if (data.dimensions.height === data.dimensions.width) return "center";

  return `${(tileSize - pieceInnerMargin * 2) / 2}px
  ${(tileSize - pieceInnerMargin * 2) / 2}px`;
}

function clampPieceLocationToBounds(
  { row, col }: { row: number; col: number },
  { rotation, dimensions }: PieceData
) {
  if (dimensions.width === dimensions.height) {
    return {
      row: clamp(row, 0, tilesHigh - dimensions.height),
      col: clamp(col, 0, tilesWide - dimensions.width),
    };
  }

  let minRow;
  let maxRow;
  let minCol;
  let maxCol;

  switch (rotation) {
    case 0:
      minRow = 0;
      maxRow = tilesHigh - dimensions.height;
      minCol = 0;
      maxCol = tilesWide - dimensions.width;
      break;
    case 90:
      minRow = 0;
      maxRow = tilesHigh - 1;
      minCol = dimensions.width;
      maxCol = tilesWide - 1;
      break;
    case 180:
      minRow = dimensions.height - 1;
      maxRow = tilesWide - 1;
      minCol = 0;
      maxCol = tilesWide - dimensions.width;
      break;
    case 270:
      minRow = dimensions.width - 1;
      maxRow = tilesWide - dimensions.width;
      minCol = 0;
      maxCol = tilesWide - dimensions.height;
      break;
  }

  return {
    row: clamp(row, minRow, maxRow),
    col: clamp(col, minCol, maxCol),
  };
}

const StyledPiece = styled.div<{
  $tilesWide;
  $tilesHigh;
  $row;
  $col;
  $rotation;
  $data;
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
  /* grid-row-start: ${(props) => props.$row + 1};
  grid-column-start: ${(props) => props.$col + 1}; */

  position: relative;
  pointer-events: all;

  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;

  transform-origin: ${(props) => calcTransformOrigin(props.$data)};
  transform: rotate(${(props) => props.$rotation}deg);

  margin: ${pieceInnerMargin}px;

  user-select: none;

  /**
   * This style applies to the dragged element.
   */
  &:active {
    cursor: grab;
    /* transform: rotate(${(props) => props.$rotation}deg) translate(-50%); */
  }
`;

export const Piece = ({ children, data, movePiece, rotatePiece }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      onStart={() => {
        setIsDragging(true);
      }}
      onStop={(event, { x, y }) => {
        const effectiveX = x + pieceInnerMargin;
        const effectiveY = y + pieceInnerMargin;

        // Add tileSize / 2 to align the snapping to the visual
        // position of the dragged piece.
        const row = Math.floor((effectiveY + tileSize / 2) / tileSize);
        const col = Math.floor((effectiveX + tileSize / 2) / tileSize);

        movePiece(data.id, { row, col });

        setIsDragging(false);
      }}
      position={{
        x: data.location.col * tileSize,
        y: data.location.row * tileSize,
      }}
    >
      <div style={{ position: "absolute" }}>
        <StyledPiece
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          $data={data}
          $tilesWide={data.dimensions.width}
          $tilesHigh={data.dimensions.height}
          $row={data.location?.row ?? 0}
          $col={data.location?.col ?? 0}
          $rotation={data.rotation}
          onDoubleClick={() => {
            rotatePiece(data.id, (data.rotation + 90) % 360);
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
  rotation: 0 | 90 | 180 | 270;
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

/**
 * The dimensions of a pice must be either
 * square, or it must be higher than it is
 * tall.
 *
 * The current rotation and clamping logic
 * for movement doesn't support wider pieces
 * correctly.
 */

const startingPieces: PieceData[] = [
  {
    id: uuid(),
    rotation: 0,
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
    rotation: 0,
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
  {
    id: uuid(),
    rotation: 0,
    location: {
      row: 1,
      col: 4,
    },
    dimensions: {
      width: 1,
      height: 3,
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

      if (pieceDataIndex === -1)
        throw new Error(`Piece doesn't have data. ${pieceId}`);

      const clampedLocation = clampPieceLocationToBounds(
        newLocation,
        prevData[pieceDataIndex]
      );

      const newData = update(prevData, pieceDataIndex, {
        ...prevData[pieceDataIndex],
        location: clampedLocation,
      });

      return newData;
    });
  };

  /**
   * TODO:
   * For not even pieces, rotation actually needs to MOVE
   * the piece, right?
   */
  const rotatePiece = (pieceId, newRotation) => {
    setPiecesData((prevData) => {
      const pieceDataIndex = prevData.findIndex((data) => data.id === pieceId);

      if (pieceDataIndex === -1)
        throw new Error(`Piece doesn't have data. ${pieceId}`);

      const clampedLocation = clampPieceLocationToBounds(
        prevData[pieceDataIndex].location,
        {
          ...prevData[pieceDataIndex],
          rotation: newRotation,
        }
      );

      const newData = update(prevData, pieceDataIndex, {
        ...prevData[pieceDataIndex],
        // location: clampedLocation,
        rotation: newRotation,
      });

      return newData;
    });
  };

  const { boardPieces, trayPieces } = useMemo(() => {
    const boardPieces = piecesData
      .filter((data) => data.location !== null)
      .map((data) => {
        return (
          <Piece
            key={data.id}
            data={data}
            movePiece={movePiece}
            rotatePiece={rotatePiece}
          >
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
          <Piece
            key={data.id}
            data={data}
            movePiece={movePiece}
            rotatePiece={rotatePiece}
          >
            <Piece.Top>{data.words.top}</Piece.Top>
            <Piece.Bottom>{data.words.bottom}</Piece.Bottom>
            <Piece.Left>{data.words.left}</Piece.Left>
            <Piece.Right>{data.words.right}</Piece.Right>
          </Piece>
        );
      });

    return { boardPieces, trayPieces };
  }, [piecesData]);

  return { boardPieces, trayPieces, movePiece, rotatePiece };
};
