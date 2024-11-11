import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { gridGap, tileSize } from "./Board";
import { useDrag, useDragDropManager } from "react-dnd";
import { palette } from "./palette";
import { v4 as uuid } from "uuid";
import { update } from "./arrays";

export const pieceInnerMargin = 8;

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
    pieceInnerMargin}px;
  height: ${(props) =>
    props.$tilesHigh * tileSize +
    (props.$tilesHigh - 1) * gridGap -
    pieceInnerMargin}px;

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
  transform: rotate(${(props) => props.$rotation}deg);

  margin: ${pieceInnerMargin}px;

  /**
   * This style applies to the dragged element.
   */
  &:active {
    cursor: grab;
    transform: rotate(${(props) => props.$rotation}deg);
  }
`;

export const Piece = ({ children, data }) => {
  const dragDropManager = useDragDropManager();
  const [isAnyPieceDragging, setIsAnyPieceDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: DragItemTypes.PIECE,
    item: { data },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    const unsubscribe = dragDropManager
      .getMonitor()
      .subscribeToStateChange(() => {
        /**
         * HACK:
         * Reacting to global dragging piece instantly prevents
         * the drag from occurring. We add a setTimeout(0) here to
         * defer this pointer-events disable so it still allows this
         * element to be dragged.
         */
        setTimeout(
          () =>
            setIsAnyPieceDragging(dragDropManager.getMonitor().isDragging()),
          0
        );
      });

    return unsubscribe;
  }, [dragDropManager]);

  return (
    <StyledPiece
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        /**
         * Prevent any pieces from blocking drop events. ReactDND
         * doesn't seem to have a built in way to support this so
         * we hacked it in.
         */
        pointerEvents: isAnyPieceDragging ? "none" : undefined,
      }}
      ref={dragRef}
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

  const { boardPieces, trayPieces } = useMemo(() => {
    const boardPieces = piecesData
      .filter((data) => data.location !== null)
      .map((data) => {
        return (
          <Piece key={data.id} data={data}>
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
          <Piece key={data.id} data={data}>
            <Piece.Top>{data.words.top}</Piece.Top>
            <Piece.Bottom>{data.words.bottom}</Piece.Bottom>
            <Piece.Left>{data.words.left}</Piece.Left>
            <Piece.Right>{data.words.right}</Piece.Right>
          </Piece>
        );
      });

    return { boardPieces, trayPieces };
  }, [piecesData]);

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

  return { boardPieces, trayPieces, movePiece };
};
