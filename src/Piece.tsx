import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { gridGap, tilesHigh, tileSize, tilesWide } from "./Board";
import { palette } from "./palette";
import { v4 as uuid } from "uuid";
import { update } from "./arrays";
import Draggable from "react-draggable";
import { clamp } from "./numbers";
import { PieceData, solutionPieces, startingPieces } from "./data";
import clockwiseRotationIcon from "inline-text:./clockwise-rotation.svg";
import confirmedIcon from "inline-text:./confirmed.svg";

export const pieceInnerMargin = 4;

function calcTransformOrigin(data: PieceData) {
  if (data.dimensions.height === data.dimensions.width) return "center";

  return `${(tileSize - pieceInnerMargin * 2) / 2}px
  ${(tileSize - pieceInnerMargin * 2) / 2}px`;
}

function calcRotateButtonPosition(data: PieceData) {
  if (data.dimensions.height === data.dimensions.width)
    return { top: "50%", left: "50%" };

  return {
    top: `${(tileSize - pieceInnerMargin * 2) / 2}px`,
    left: `${(tileSize - pieceInnerMargin * 2) / 2}px`,
  };
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

  switch (rotation % 360) {
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
  $valid;
}>`
  width: ${(props) =>
    props.$tilesWide * tileSize +
    (props.$tilesWide - 1) * gridGap -
    pieceInnerMargin * 2}px;
  height: ${(props) =>
    props.$tilesHigh * tileSize +
    (props.$tilesHigh - 1) * gridGap -
    pieceInnerMargin * 2}px;

  background-color: ${(props) =>
    props.$valid ? palette.GREEN : palette.OFF_WHITE};
  grid-column: span ${(props) => props.$tilesWide};
  grid-row: span ${(props) => props.$tilesHigh};

  position: relative;
  pointer-events: all;

  font-weight: bold;

  transition: 200ms;
  transition-property: transform;
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

export const Piece = ({ children, data, movePiece, rotatePiece, valid }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      cancel=".no-drag"
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
        x: (data.location?.col ?? 0) * tileSize,
        y: (data.location?.row ?? 0) * tileSize,
      }}
      disabled={valid}
    >
      <div style={{ position: "absolute" }}>
        <StyledPiece
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            /**
             * The transform prop needs to be out here and not in the
             * styled component so it can be properly transitioned by
             * the css transition value when it changes.
             */
            transform: `rotate(${(props) => props.$rotation}deg)`,
          }}
          $data={data}
          $tilesWide={data.dimensions.width}
          $tilesHigh={data.dimensions.height}
          $row={data.location?.row ?? 0}
          $col={data.location?.col ?? 0}
          $rotation={data.rotation}
          $valid={valid}
          onDoubleClick={
            valid
              ? () => {}
              : () => {
                  rotatePiece(data.id, data.rotation + 90);
                }
          }
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
  left: 0.5em;
  top: 50%;
  transform: translateX(-50%) rotate(90deg);
`;

const Right = styled.div`
  position: absolute;
  right: 0.75em;
  top: 50%;
  transform: translateX(50%) rotate(270deg);
`;

Piece.Top = Top;
Piece.Bottom = Bottom;
Piece.Left = Left;
Piece.Right = Right;

const PieceButtonContainer = styled.div`
  position: absolute;
`;

const RotateButtonContainer = styled.div`
  &:hover {
    transition: 100ms;
    transition-property: transform;
    transform: scale(1.2) rotate(12deg);
  }
`;

export const usePieces = () => {
  const [checkCount, setCheckCount] = useState(0);
  const [validatedIds, setValidatedIds] = useState<Set<string>>(new Set());
  const [piecesData, setPiecesData] = useState<PieceData[]>(
    () => startingPieces
  );

  const movePiece = (pieceId, newLocation) => {
    setPiecesData((prevData) => {
      const pieceDataIndex = prevData.findIndex((data) => data.id === pieceId);

      if (pieceDataIndex === -1)
        throw new Error(`Piece doesn't have data. ${pieceId}`);

      // if (newLocation.row >= tilesHigh) {
      //   // dragged off the bottom of the grid

      //   return update(prevData, pieceDataIndex, {
      //     ...prevData[pieceDataIndex],
      //     location: null,
      //   });
      // }

      // const clampedLocation = clampPieceLocationToBounds(
      //   newLocation,
      //   prevData[pieceDataIndex]
      // );

      const newData = update(prevData, pieceDataIndex, {
        ...prevData[pieceDataIndex],
        location: newLocation,
      });

      return newData;
    });
  };

  /**
   * TODO:
   * The rotation values in this could technically overflow. Ideally,
   * I'd want to modulo these by 360 to be certain that this couldn't happen.
   *
   * However, the way that css transition animations work, I need to keep
   * increasing the degree value for the rotation to work as expected.
   *
   * I think I could add extra logic to disable the transition, and switch
   * from 360deg after animation back to 0deg and then re-enable the
   * transition prop.
   */
  const rotatePiece = (pieceId, newRotation) => {
    setPiecesData((prevData) => {
      const pieceDataIndex = prevData.findIndex((data) => data.id === pieceId);

      if (pieceDataIndex === -1)
        throw new Error(`Piece doesn't have data. ${pieceId}`);

      // const clampedLocation = clampPieceLocationToBounds(
      //   prevData[pieceDataIndex].location,
      //   {
      //     ...prevData[pieceDataIndex],
      //     rotation: newRotation,
      //   }
      // );

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
            valid={validatedIds.has(data.id)}
            movePiece={movePiece}
            rotatePiece={rotatePiece}
          >
            <PieceButtonContainer
              style={{
                ...calcRotateButtonPosition(data),
              }}
            >
              <div
                className="no-drag"
                style={{
                  width: "3rem",
                  transform: `translate(-50%, -50%) rotate(${-data.rotation}deg)`,
                }}
              >
                {validatedIds.has(data.id) ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: confirmedIcon }}
                  ></span>
                ) : (
                  <button
                    onDoubleClick={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      rotatePiece(data.id, data.rotation + 90);
                    }}
                    style={{
                      fontSize: "2rem",
                      border: "none",
                      background: "none",
                      textShadow: `2px 2px 0 ${palette.BLACK}`,
                      cursor: "pointer",
                    }}
                  >
                    <RotateButtonContainer
                      dangerouslySetInnerHTML={{
                        __html: clockwiseRotationIcon,
                      }}
                    ></RotateButtonContainer>
                  </button>
                )}
              </div>
            </PieceButtonContainer>
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
            valid={false}
          >
            <Piece.Top>{data.words.top}</Piece.Top>
            <Piece.Bottom>{data.words.bottom}</Piece.Bottom>
            <Piece.Left>{data.words.left}</Piece.Left>
            <Piece.Right>{data.words.right}</Piece.Right>
          </Piece>
        );
      });

    return { boardPieces, trayPieces };
  }, [piecesData, validatedIds]);

  // const checkCount = validatedIds.size;

  const check = () => {
    setCheckCount(checkCount + 1);
    const newValidatedIds = new Set(validatedIds);

    piecesData.forEach((piece) => {
      const solutionPiece = solutionPieces.find(
        (solutionPiece) => solutionPiece.id === piece.id
      );

      if (!solutionPiece) return;

      if (
        solutionPiece.location?.row === piece.location?.row &&
        solutionPiece.location?.col === piece.location?.col &&
        /**
         * This needs to be modulo by 360, because piece rotation
         * can be set to any value on rotation.
         */
        solutionPiece.rotation % 360 === piece.rotation % 360
      ) {
        newValidatedIds.add(piece.id);
      }
    });

    setValidatedIds(newValidatedIds);
  };

  return { boardPieces, checkCount, check, movePiece, rotatePiece };
};
