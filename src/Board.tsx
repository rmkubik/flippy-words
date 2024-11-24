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
      return 0;
    case "left":
      return 270;
  }
}

function calcWordTop(side, start, width) {
  switch (side) {
    case "top":
      return `-${WORD_HEIGHT}px`;
    case "right": {
      const basePosition = -WORD_HEIGHT + start * tileSize;

      if (start === 0) {
        return `${basePosition}px`;
      }

      return `${basePosition + borderWidth / 2}px`;
    }
    case "bottom":
      return `${tilesHigh * tileSize + borderWidth * 2}px`;
    case "left": {
      const basePosition =
        -WORD_HEIGHT +
        tilesHigh * tileSize -
        start * tileSize +
        borderWidth * 2;

      if (start === 0) {
        return `${basePosition}px`;
      }

      return `${basePosition - borderWidth / 2}px`;
    }
  }
}

function calcWordLeft(side, start, width) {
  switch (side) {
    case "top": {
      const basePosition = start * tileSize;

      if (start === 0) {
        return `${basePosition}px`;
      }

      return `${basePosition + borderWidth / 2}px`;
    }
    case "right":
      return `${tilesWide * tileSize + borderWidth * 2}px`;
    case "bottom":
      if (start === 0) {
        return "0px";
      }

      return `${start * tileSize + borderWidth / 2}px`;
    case "left":
      return undefined;
  }
}

function calcWordWidth(side, start, width) {
  let pixelWidth = width * tileSize + borderWidth;

  const isFirstWord = start === 0;
  const isLastWord = start + width >= tilesWide;

  if (isFirstWord || isLastWord) {
    pixelWidth += borderWidth / 2;
  }

  return `${pixelWidth}px`;

  // switch (side) {
  //   case "top": {
  //     let pixelWidth = width * tileSize + borderWidth;

  //     const isFirstWord = start === 0;
  //     const isLastWord = start + width >= tilesWide;

  //     if (isFirstWord || isLastWord) {
  //       pixelWidth += borderWidth / 2;
  //     }

  //     return `${pixelWidth}px`;
  //   }

  //   case "right":
  //   case "left":
  //   case "bottom":
  //     return `${width * tileSize}px`;
  // }
}

const Word = styled.span<{
  $width: number;
  $side: "top" | "left" | "bottom" | "right";
  $start: number;
}>`
  /* font-family: Arial, Helvetica, sans-serif; */
  font-weight: bold;

  display: block;
  box-sizing: border-box;
  width: ${(props) => calcWordWidth(props.$side, props.$start, props.$width)};

  border-left: ${borderWidth}px solid black;
  border-right: ${borderWidth}px solid black;

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
    <div style={{ width: "fit-content", position: "relative", margin: "2rem" }}>
      <Word $width={2} $side="top" $start={0}>
        highway
      </Word>
      <Word $width={2} $side="top" $start={2}>
        tv
      </Word>
      <Word $width={1} $side="top" $start={4}>
        volume
      </Word>
      <Word $width={2} $side="bottom" $start={0}>
        ignite
      </Word>
      <Word $width={3} $side="bottom" $start={2}>
        weed
      </Word>
      <Word $width={1} $side="left" $start={0}>
        beans
      </Word>
      <Word $width={1} $side="left" $start={1}>
        rice
      </Word>
      <Word $width={3} $side="left" $start={2}>
        freezer
      </Word>
      <Word $width={3} $side="right" $start={0}>
        shipping
      </Word>
      <Word $width={2} $side="right" $start={3}>
        right
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
