/**
 * Entanglement Graph + Cycle Detection (DFS)
 *
 * Nodes = board cells (0-8)
 * Edges = quantum moves (each move connects its two chosen cells)
 *
 * When a cycle is detected, all moves in that cycle must collapse.
 */

export interface GraphEdge {
  moveId: number;
  cellA: number;
  cellB: number;
}

export interface CycleResult {
  edges: GraphEdge[];
  cells: number[];
}

export class EntanglementGraph {
  private edges: GraphEdge[] = [];
  private adj: Map<number, { neighbor: number; edge: GraphEdge }[]> = new Map();

  clear() {
    this.edges = [];
    this.adj = new Map();
  }

  addEdge(moveId: number, cellA: number, cellB: number) {
    const edge: GraphEdge = { moveId, cellA, cellB };
    this.edges.push(edge);

    if (!this.adj.has(cellA)) this.adj.set(cellA, []);
    if (!this.adj.has(cellB)) this.adj.set(cellB, []);
    this.adj.get(cellA)!.push({ neighbor: cellB, edge });
    this.adj.get(cellB)!.push({ neighbor: cellA, edge });
  }

  removeEdge(moveId: number) {
    this.edges = this.edges.filter(e => e.moveId !== moveId);
    // Rebuild adjacency
    this.adj = new Map();
    for (const edge of this.edges) {
      if (!this.adj.has(edge.cellA)) this.adj.set(edge.cellA, []);
      if (!this.adj.has(edge.cellB)) this.adj.set(edge.cellB, []);
      this.adj.get(edge.cellA)!.push({ neighbor: edge.cellB, edge });
      this.adj.get(edge.cellB)!.push({ neighbor: edge.cellA, edge });
    }
  }

  getEdges(): GraphEdge[] {
    return [...this.edges];
  }

  getAdj(): Map<number, { neighbor: number; edge: GraphEdge }[]> {
    return this.adj;
  }

  /**
   * Find ALL cycles in the graph using DFS.
   * Returns the first cycle found (for immediate collapse) or null.
   */
  findCycle(): CycleResult | null {
    if (this.edges.length < 2) return null;

    const visited = new Map<number, number>(); // cell -> parent cell
    const edgeTo = new Map<number, GraphEdge>(); // cell -> edge used to reach it

    const reconstruct = (start: number, end: number, backEdge: GraphEdge): CycleResult | null => {
      const cycleEdges: GraphEdge[] = [backEdge];
      const cycleCells = new Set<number>();
      cycleCells.add(start);
      cycleCells.add(end);

      let cur = start;
      while (cur !== end) {
        const parent = visited.get(cur)!;
        const edge = edgeTo.get(cur)!;
        cycleEdges.push(edge);
        cycleCells.add(parent);
        cur = parent;
      }

      // Deduplicate edges by moveId
      const seenIds = new Set<number>();
      const unique: GraphEdge[] = [];
      for (const e of cycleEdges) {
        if (!seenIds.has(e.moveId)) {
          seenIds.add(e.moveId);
          unique.push(e);
        }
      }

      if (unique.length < 2) return null;
      return { edges: unique, cells: [...cycleCells] };
    };

    const dfs = (cell: number, parent: number, viaEdge: GraphEdge | null): CycleResult | null => {
      visited.set(cell, parent);
      if (viaEdge) edgeTo.set(cell, viaEdge);

      for (const { neighbor, edge } of (this.adj.get(cell) || [])) {
        if (edge === viaEdge) continue; // don't walk back same edge
        if (edge.moveId === viaEdge?.moveId) continue; // same move

        if (visited.has(neighbor)) {
          return reconstruct(cell, neighbor, edge);
        } else {
          const result = dfs(neighbor, cell, edge);
          if (result) return result;
        }
      }
      return null;
    };

    for (const startCell of this.adj.keys()) {
      if (!visited.has(startCell)) {
        const result = dfs(startCell, -1, null);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * Find all cycles (for simultaneous collapse).
   */
  findAllCycles(): CycleResult[] {
    const cycles: CycleResult[] = [];
    const processed = new Set<number>(); // processed moveIds

    let cycle = this.findCycle();
    while (cycle) {
      cycles.push(cycle);
      // Remove the cycle edges to find more
      for (const e of cycle.edges) {
        processed.add(e.moveId);
      }
      // Temporarily remove to find next
      const tempGraph = new EntanglementGraph();
      for (const e of this.edges) {
        if (!processed.has(e.moveId)) {
          tempGraph.addEdge(e.moveId, e.cellA, e.cellB);
        }
      }
      cycle = tempGraph.findCycle();
    }

    return cycles;
  }

  /** Check if cell has >= 3 marks (backup collapse rule) */
  cellMarkCount(cell: number): number {
    return (this.adj.get(cell) || []).length;
  }

  /** Get cells with >= threshold marks */
  overloadedCells(threshold: number): number[] {
    const result: number[] = [];
    for (const [cell, neighbors] of this.adj) {
      if (neighbors.length >= threshold) {
        result.push(cell);
      }
    }
    return result;
  }
}
