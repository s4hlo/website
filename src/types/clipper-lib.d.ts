declare module 'clipper-lib' {
  export namespace JoinType {
    const jtSquare: number;
    const jtRound: number;
    const jtMiter: number;
  }

  export namespace EndType {
    const etClosedPolygon: number;
    const etClosedLine: number;
    const etOpenButt: number;
    const etOpenSquare: number;
    const etOpenRound: number;
  }

  export class ClipperOffset {
    constructor(miterLimit: number, arcTolerance: number);
    AddPath(
      path: { X: number; Y: number }[],
      joinType: number,
      endType: number,
    ): void;
    Execute(solutionPaths: { X: number; Y: number }[][], delta: number): void;
  }
}
