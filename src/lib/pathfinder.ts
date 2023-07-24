import { MapInfo } from './maps';

const DIAGONAL_MOVEMENT_COST = 14;
const NONDIAGONAL_MOVEMENT_COST = 10;

/**
 * An A* search algorithm-based pathfinder for EL maps.
 */
export function findPath(
  mapInfo: MapInfo,
  startTile: { x: number; y: number },
  endTile: { x: number; y: number }
): GraphNode[] | null {
  const graph = new Graph(mapInfo);
  const startNode = graph.nodes[startTile.x][startTile.y];
  const endNode = graph.nodes[endTile.x][endTile.y];
  const closedSet = new Set<GraphNode>(); // Set of nodes already evaluated.
  const openSet = new Set<GraphNode>(); // Set of tentative nodes to be evaluated.
  const gScores = new Map<GraphNode, number>();
  const hScores = new Map<GraphNode, number>();
  const fScores = new Map<GraphNode, number>();
  const backtrack = new Map<GraphNode, GraphNode>();

  openSet.add(startNode);
  gScores.set(startNode, 0);
  hScores.set(startNode, getHeuristicCost(startNode, endNode));
  fScores.set(startNode, gScores.get(startNode)! + hScores.get(startNode)!);

  while (openSet.size > 0) {
    const node: GraphNode = getLowestCostNode(openSet, fScores);

    if (node === endNode) {
      return reconstructPath(node, backtrack);
    }

    openSet.delete(node);
    closedSet.add(node);

    for (const [direction, neighbour] of node.neighbours) {
      if (
        closedSet.has(neighbour) ||
        !mapInfo.isTileWalkable(neighbour.x, neighbour.y)
      ) {
        continue;
      }

      const tentativeGScore = gScores.get(node)! + getMovementCost(direction);

      if (openSet.has(neighbour) && gScores.get(neighbour)! < tentativeGScore) {
        continue;
      }

      openSet.add(neighbour);
      gScores.set(neighbour, tentativeGScore);
      hScores.set(neighbour, getHeuristicCost(neighbour, endNode));
      fScores.set(neighbour, gScores.get(neighbour)! + hScores.get(neighbour)!);
      backtrack.set(neighbour, node);
    }
  }

  return null;
}

/**
 * Get the actual cost of moving one node in a particular direction.
 */
function getMovementCost(direction: GraphDirection): number {
  switch (direction) {
    case GraphDirection.WEST:
    case GraphDirection.EAST:
    case GraphDirection.SOUTH:
    case GraphDirection.NORTH:
      return NONDIAGONAL_MOVEMENT_COST;
    case GraphDirection.SOUTHWEST:
    case GraphDirection.NORTHWEST:
    case GraphDirection.SOUTHEAST:
    case GraphDirection.NORTHEAST:
      return DIAGONAL_MOVEMENT_COST;
  }
}

/**
 * Estimate the cost of moving from one node to another. Uses the "octile distance" heuristic.
 *
 * See: https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#diagonal-distance
 */
function getHeuristicCost(fromNode: GraphNode, toNode: GraphNode): number {
  const dx = Math.abs(fromNode.x - toNode.x);
  const dy = Math.abs(fromNode.y - toNode.y);

  return (
    NONDIAGONAL_MOVEMENT_COST * (dx + dy) +
    (DIAGONAL_MOVEMENT_COST - 2 * NONDIAGONAL_MOVEMENT_COST) * Math.min(dx, dy)
  );
}

function getLowestCostNode(
  openSet: Set<GraphNode>,
  fScores: Map<GraphNode, number>
): GraphNode {
  let lowestCostNode: GraphNode | null = null;

  for (const node of openSet) {
    if (!lowestCostNode || fScores.get(lowestCostNode)! > fScores.get(node)!) {
      lowestCostNode = node;
    }
  }

  return lowestCostNode!;
}

function reconstructPath(
  node: GraphNode,
  backtrack: Map<GraphNode, GraphNode>
): GraphNode[] {
  const path = [];

  let neighbour: GraphNode | undefined = node;
  while (neighbour) {
    path.unshift(neighbour);
    neighbour = backtrack.get(neighbour);
  }

  return path;
}

class Graph {
  readonly width: number;
  readonly height: number;
  readonly nodes: GraphNode[][];

  constructor(mapInfo: MapInfo) {
    this.width = mapInfo.width;
    this.height = mapInfo.height;
    this.nodes = [];

    for (let x = 0; x < mapInfo.width; x++) {
      const arr: GraphNode[] = [];
      this.nodes.push(arr);

      for (let y = 0; y < mapInfo.height; y++) {
        arr.push(new GraphNode(this, x, y));
      }
    }
  }
}

class GraphNode {
  readonly graph: Graph;
  readonly x: number;
  readonly y: number;

  constructor(graph: Graph, x: number, y: number) {
    this.graph = graph;
    this.x = x;
    this.y = y;
  }

  get neighbours(): Map<GraphDirection, GraphNode> {
    const neighbours = new Map();

    if (this.x > 0) {
      neighbours.set(GraphDirection.WEST, this.graph.nodes[this.x - 1][this.y]);
    }
    if (this.x < this.graph.width - 1) {
      neighbours.set(GraphDirection.EAST, this.graph.nodes[this.x + 1][this.y]);
    }
    if (this.y > 0) {
      neighbours.set(
        GraphDirection.SOUTH,
        this.graph.nodes[this.x][this.y - 1]
      );
    }
    if (this.y < this.graph.height - 1) {
      neighbours.set(
        GraphDirection.NORTH,
        this.graph.nodes[this.x][this.y + 1]
      );
    }
    if (this.x > 0 && this.y > 0) {
      neighbours.set(
        GraphDirection.SOUTHWEST,
        this.graph.nodes[this.x - 1][this.y - 1]
      );
    }
    if (this.x > 0 && this.y < this.graph.height - 1) {
      neighbours.set(
        GraphDirection.NORTHWEST,
        this.graph.nodes[this.x - 1][this.y + 1]
      );
    }
    if (this.x < this.graph.width - 1 && this.y > 0) {
      neighbours.set(
        GraphDirection.SOUTHEAST,
        this.graph.nodes[this.x + 1][this.y - 1]
      );
    }
    if (this.x < this.graph.width - 1 && this.y < this.graph.height - 1) {
      neighbours.set(
        GraphDirection.NORTHEAST,
        this.graph.nodes[this.x + 1][this.y + 1]
      );
    }

    return neighbours;
  }
}

enum GraphDirection {
  WEST,
  EAST,
  SOUTH,
  NORTH,
  SOUTHWEST,
  NORTHWEST,
  SOUTHEAST,
  NORTHEAST,
}
