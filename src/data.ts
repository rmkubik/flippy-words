export type PieceData = {
  id: string;
  rotation: 0 | 90 | 180 | 270;
  location: {
    row: number;
    col: number;
  } | null;
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

export const startingPieces: PieceData[] = [
  {
    id: "1",
    rotation: 270,
    location: { row: 4, col: 6 },
    dimensions: { width: 2, height: 2 },
    words: { top: "traffic", bottom: "bone", right: "right", left: "thaw" },
  },
  {
    id: "2",
    rotation: 90,
    location: { row: 1, col: 4 },
    dimensions: { width: 2, height: 3 },
    words: { top: "ice", bottom: "magma", right: "young", left: "burrito" },
  },
  {
    id: "3",
    rotation: 0,
    location: { row: 0, col: 6 },
    dimensions: { width: 1, height: 4 },
    words: {
      top: "wheat",
      bottom: "dandelion",
      right: "bottle",
      left: "pencil",
    },
  },
  {
    id: "4",
    rotation: 180,
    location: { row: 3, col: 7 },
    dimensions: { width: 1, height: 3 },
    words: { top: "container", bottom: "gourd", right: "lamp", left: "remote" },
  },
  {
    id: "5",
    rotation: 180,
    location: { row: 3, col: 1 },
    dimensions: { width: 1, height: 2 },
    words: {
      top: "hull",
      bottom: "table",
      right: "controller",
      left: "picture",
    },
  },
  {
    id: "6",
    rotation: 90,
    location: { row: 0, col: 0 },
    dimensions: { width: 2, height: 2 },
    words: { top: "book", bottom: "novel", right: "starboard", left: "car" },
  },
  {
    id: "7",
    rotation: 270,
    location: { row: 4, col: 2 },
    dimensions: { width: 1, height: 2 },
    words: { top: "net", bottom: "expand", right: "joint", left: "mouth" },
  },
];

/**
 * The dimensions of a pice must be either
 * square, or it must be higher than it is
 * tall.
 *
 * The current rotation and clamping logic
 * for movement doesn't support wider pieces
 * correctly.
 */
export const solutionPieces: PieceData[] = [
  {
    id: "1",
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
      top: "traffic", // answer
      bottom: "bone",
      right: "right",
      left: "thaw", // answer
    },
  },
  {
    id: "2",
    rotation: 0,
    location: {
      row: 2,
      col: 0,
    },
    dimensions: {
      width: 2,
      height: 3,
    },
    words: {
      top: "ice",
      bottom: "magma", // answer
      right: "young",
      left: "burrito", // answer
    },
  },
  {
    id: "3",
    rotation: 0,
    location: {
      row: 1,
      col: 2,
    },
    dimensions: {
      width: 1,
      height: 4,
    },
    words: {
      top: "wheat",
      bottom: "dandelion", // answer
      right: "bottle",
      left: "pencil",
    },
  },
  {
    id: "4",
    rotation: 90,
    location: {
      row: 0,
      col: 4,
    },
    dimensions: {
      width: 1,
      height: 3,
    },
    words: {
      top: "container", // answer
      bottom: "gourd",
      right: "lamp",
      left: "remote", // answer
    },
  },
  {
    id: "5",
    rotation: 90,
    location: {
      row: 1,
      col: 4,
    },
    dimensions: {
      width: 1,
      height: 2,
    },
    words: {
      top: "hull", // answer
      bottom: "table",
      right: "controller",
      left: "picture",
    },
  },
  {
    id: "6",
    rotation: 0,
    location: {
      row: 2,
      col: 3,
    },
    dimensions: {
      width: 2,
      height: 2,
    },
    words: {
      top: "book",
      bottom: "novel",
      right: "starboard", // answer
      left: "car",
    },
  },
  {
    id: "7",
    rotation: 90,
    location: {
      row: 4,
      col: 4,
    },
    dimensions: {
      width: 1,
      height: 2,
    },
    words: {
      top: "net", // answer
      bottom: "expand",
      right: "joint", // answer
      left: "mouth",
    },
  },
];
