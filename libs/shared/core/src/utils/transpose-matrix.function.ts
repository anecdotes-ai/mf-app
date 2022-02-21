export function transposeMatrix<T>(matrix: T[][]): T[][] {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}
