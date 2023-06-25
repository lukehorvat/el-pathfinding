/**
 * An A* search algorithm-based pathfinder for EL maps.
 */
export function findPath(fromNode: GraphNode, toNode: GraphNode): GraphNode[] {
  const closedSet = new Set<GraphNode>(); // Set of nodes already evaluated.
  const openSet = new Set<GraphNode>(); // Set of tentative nodes to be evaluated.
  const gScores = new Map<GraphNode, number>();
  const hScores = new Map<GraphNode, number>();
  const fScores = new Map<GraphNode, number>();
  const backtrack: Map<GraphNode, GraphNode> = new Map();

  openSet.add(fromNode);
  gScores.set(fromNode, 0);
  hScores.set(fromNode, getCostHeuristic(fromNode, toNode));
  fScores.set(fromNode, hScores.get(fromNode)!);

  while (openSet.size > 0) {
    const node: GraphNode = getLowestCostNode(openSet, fScores);

    if (node === toNode) {
      return reconstructPath(toNode, backtrack);
    }

    openSet.delete(node);
    closedSet.add(node);

    for (const neighbour of node.neighbours) {
      if (closedSet.has(neighbour)) {
        continue;
      }

      const tentativeGScore =
        gScores.get(node)! + getCostHeuristic(node, neighbour);

      if (openSet.has(neighbour) && gScores.get(neighbour)! < tentativeGScore) {
        continue;
      }

      openSet.add(neighbour);
      gScores.set(neighbour, tentativeGScore);
      hScores.set(neighbour, getCostHeuristic(neighbour, toNode));
      fScores.set(neighbour, gScores.get(neighbour)! + hScores.get(neighbour)!);
      backtrack.set(neighbour, node);
    }
  }

  return [];
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

/**
 * Use the "diagonal distance" heuristic to estimate the distance from one node to another.
 */
function getCostHeuristic(fromNode: GraphNode, toNode: GraphNode): number {
  const xDistance = Math.abs(fromNode.x - toNode.x);
  const yDistance = Math.abs(fromNode.y - toNode.y);
  if (xDistance > yDistance) {
    return 14 * yDistance + 10 * (xDistance - yDistance);
  } else {
    return 14 * xDistance + 10 * (yDistance - xDistance);
  }
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

export class Graph {
  readonly width: number;
  readonly height: number;
  readonly nodes: GraphNode[][];

  constructor(width: number, height: number, tiles: number[][]) {
    this.width = width;
    this.height = height;
    this.nodes = [];

    for (let x = 0; x < width; x++) {
      const arr: GraphNode[] = [];
      this.nodes.push(arr);

      for (let y = 0; y < height; y++) {
        arr.push(new GraphNode(this, x, y, !!tiles[x][y]));
      }
    }
  }
}

export class GraphNode {
  readonly graph: Graph;
  readonly x: number;
  readonly y: number;
  readonly walkable: boolean;

  constructor(graph: Graph, x: number, y: number, walkable: boolean) {
    this.graph = graph;
    this.x = x;
    this.y = y;
    this.walkable = walkable;
  }

  get neighbours(): GraphNode[] {
    const neighbours = [];

    if (this.x > 0) {
      neighbours.push(this.graph.nodes[this.x - 1][this.y]); // west
    }
    if (this.x < this.graph.width - 1) {
      neighbours.push(this.graph.nodes[this.x + 1][this.y]); // east
    }
    if (this.y > 0) {
      neighbours.push(this.graph.nodes[this.x][this.y - 1]); // south
    }
    if (this.y < this.graph.height - 1) {
      neighbours.push(this.graph.nodes[this.x][this.y + 1]); // north
    }
    if (this.x > 0 && this.y > 0) {
      neighbours.push(this.graph.nodes[this.x - 1][this.y - 1]); // south-west
    }
    if (this.x > 0 && this.y < this.graph.height - 1) {
      neighbours.push(this.graph.nodes[this.x - 1][this.y + 1]); // north-west
    }
    if (this.x < this.graph.width - 1 && this.y > 0) {
      neighbours.push(this.graph.nodes[this.x + 1][this.y - 1]); // south-east
    }
    if (this.x < this.graph.width - 1 && this.y < this.graph.height - 1) {
      neighbours.push(this.graph.nodes[this.x + 1][this.y + 1]); // north-east
    }

    return neighbours.filter((neighbour) => neighbour.walkable);
  }
}
