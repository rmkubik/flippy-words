import React, { ReactNode, useMemo } from "react";
import styled from "styled-components";
import { palette } from "./palette";

export const tilesWide = 5;
export const tilesHigh = 5;
export const gridGap = 0;
export const tileSize = 96;
export const borderWidth = 4;

const StyledTile = styled.div<{ $color }>`
  width: ${tileSize}px;
  height: ${tileSize}px;
  background-color: ${(props) => props.$color};
`;

const Tile = ({ color }) => {
  return <StyledTile $color={color} />;
};

const StyledBaseGrid = styled.div`
  display: grid;
  grid-gap: ${gridGap}px;
  grid-template-columns: ${tileSize}px ${tileSize}px ${tileSize}px ${tileSize}px ${tileSize}px;
  grid-template-rows: ${tileSize}px ${tileSize}px ${tileSize}px ${tileSize}px ${tileSize}px;

  width: ${tileSize * tilesWide + (tilesWide - 1) * gridGap}px;
  height: ${tileSize * tilesHigh + (tilesHigh - 1) * gridGap}px;
`;

export const StyledGrid = styled(StyledBaseGrid)`
  border: ${borderWidth}px solid black;
  /* padding: 8px; */
`;

export const Grid = () => {
  const tiles = useMemo(() => {
    const innerTiles: ReactNode[] = [];
    const tileCount = tilesWide * tilesHigh;
    for (let i = 0; i < tileCount; i += 1) {
      const isEven = i % 2 === 0;
      innerTiles.push(
        <Tile key={i} color={isEven ? palette.PARCHMENT : palette.ORANGE} />
      );
    }
    return innerTiles;
  }, []);

  return <StyledGrid>{tiles}</StyledGrid>;
};

const WORD_HEIGHT = 26.5;

function calcWordRotation(side) {
  switch (side) {
    case "top":
      return 0;
    case "right":
      return 90;
    case "bottom":
      return 180;
    case "left":
      return 270;
  }
}

function calcWordTop(side, start, width) {
  switch (side) {
    case "top":
      return `-${WORD_HEIGHT}px`;
    case "right":
      return `-${WORD_HEIGHT}px`;
    case "bottom":
      return `${tilesHigh * tileSize + borderWidth * 2 - WORD_HEIGHT}px`;
    case "left":
      // return `${borderWidth + tilesHigh * tileSize}`;
      return `${-WORD_HEIGHT + tilesHigh * tileSize - start * tileSize}px`;
  }
}

function calcWordLeft(side, start, width) {
  switch (side) {
    case "top":
      return `${start * tileSize + borderWidth}px`;
    case "right":
      return `${tilesWide * tileSize + borderWidth * 2}px`;
    case "bottom":
      return `${
        borderWidth + tilesWide * tileSize - (start * tileSize + borderWidth)
      }px`;
    case "left":
      return undefined;
  }
}

const Word = styled.span<{
  $width: number;
  $side: "top" | "left" | "bottom" | "right";
  $start: number;
}>`
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;

  display: block;
  box-sizing: border-box;
  width: ${(props) => props.$width * tileSize}px;

  border-left: 2px solid black;
  border-right: 2px solid black;

  text-align: center;

  padding: 4px;

  position: absolute;
  top: ${(props) => calcWordTop(props.$side, props.$start, props.$width)};
  left: ${(props) => calcWordLeft(props.$side, props.$start, props.$width)};

  transform-origin: bottom left;
  transform: rotate(${(props) => calcWordRotation(props.$side)}deg);
`;

export const Board = ({ children }) => {
  return (
    <div style={{ width: "fit-content", position: "relative" }}>
      <Word $width={2} $side="top" $start={0}>
        Top1
      </Word>
      <Word $width={2} $side="top" $start={2}>
        Top2
      </Word>
      <Word $width={1} $side="top" $start={4}>
        Top3
      </Word>
      <Word $width={2} $side="bottom" $start={0}>
        Bottom1
      </Word>
      <Word $width={3} $side="bottom" $start={2}>
        Bottom2
      </Word>
      <Word $width={1} $side="left" $start={0}>
        Left1
      </Word>
      <Word $width={1} $side="left" $start={1}>
        Left2
      </Word>
      <Word $width={3} $side="left" $start={2}>
        Left3
      </Word>
      <Word $width={5} $side="right" $start={0}>
        Right
      </Word>
      <StyledBaseGrid
        style={{
          position: "absolute",
          pointerEvents: "none",
          margin: `${borderWidth}px`,
        }}
      >
        {children}
      </StyledBaseGrid>
      <Grid />
    </div>
  );
};
