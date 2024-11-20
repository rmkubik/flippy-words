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
      const row = Math.floor(i / tilesWide);
      const col = i % tilesWide;
      innerTiles.push(
        <Tile key={i} color={isEven ? palette.PARCHMENT : palette.ORANGE} />
      );
    }
    return innerTiles;
  }, []);

  return <StyledGrid>{tiles}</StyledGrid>;
};

export const Board = ({ children }) => {
  return (
    <div style={{ width: "fit-content" }}>
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
