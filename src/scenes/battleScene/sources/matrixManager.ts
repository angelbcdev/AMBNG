import { matrix } from "@/data/floor/matrixForFloor";

class MatrixManager {
  static instance: MatrixManager | null = null;
  matrix = matrix;

  static getInstance() {
    if (!this.instance) this.instance = new MatrixManager();
    return this.instance;
  }
}

export const MATRIX_MANAGER = MatrixManager.getInstance();
