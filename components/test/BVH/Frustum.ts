import {
  Matrix4,
  Plane,
  WebGLCoordinateSystem,
  WebGPUCoordinateSystem,
} from "three";

export enum VisibilityState {
  in,
  intersect,
  out,
}

/** @LASTREV 161 */
export class Frustum {
  public planes: Plane[];

  constructor(
    p0 = new Plane(),
    p1 = new Plane(),
    p2 = new Plane(),
    p3 = new Plane(),
    p4 = new Plane(),
    p5 = new Plane()
  ) {
    this.planes = [p0, p1, p2, p3, p4, p5];
  }

  public setFromProjectionMatrix(
    m: Matrix4,
    coordinateSystem = WebGLCoordinateSystem
  ): this {
    const planes = this.planes;
    const me = m.elements;
    const me0 = me[0],
      me1 = me[1],
      me2 = me[2],
      me3 = me[3];
    const me4 = me[4],
      me5 = me[5],
      me6 = me[6],
      me7 = me[7];
    const me8 = me[8],
      me9 = me[9],
      me10 = me[10],
      me11 = me[11];
    const me12 = me[12],
      me13 = me[13],
      me14 = me[14],
      me15 = me[15];

    planes[0]
      .setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12)
      .normalize();
    planes[1]
      .setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12)
      .normalize();
    planes[2]
      .setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13)
      .normalize();
    planes[3]
      .setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13)
      .normalize();
    planes[4]
      .setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14)
      .normalize();

    if (coordinateSystem === WebGLCoordinateSystem) {
      planes[5]
        .setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14)
        .normalize();
    } else if (coordinateSystem === WebGPUCoordinateSystem) {
      planes[5].setComponents(me2, me6, me10, me14).normalize();
    } else {
      throw new Error(
        "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
          coordinateSystem
      );
    }

    return this;
  }

  public intesectsBox(box: Float32Array): VisibilityState {
    const planes = this.planes;
    let result = VisibilityState.in;

    for (let i = 0; i < 6; i++) {
      const plane = planes[i];

      const nx = plane.normal.x > 0 ? 1 : 0;
      const ny = plane.normal.y > 0 ? 1 : 0;
      const nz = plane.normal.z > 0 ? 1 : 0;

      let dot =
        plane.normal.x * this.minMax(box, nx, 0) +
        plane.normal.y * this.minMax(box, ny, 1) +
        plane.normal.z * this.minMax(box, nz, 2);

      if (dot < -plane.constant) {
        return VisibilityState.out;
      }

      if (result === VisibilityState.intersect) continue;

      dot =
        plane.normal.x * this.minMax(box, 1 - nx, 0) +
        plane.normal.y * this.minMax(box, 1 - ny, 1) +
        plane.normal.z * this.minMax(box, 1 - nz, 2);

      if (dot <= -plane.constant) result = VisibilityState.intersect;
    }

    return result;
  }

  private minMax(box: Float32Array, index: number, axis: number): number {
    return index === 0 ? box[axis] : box[axis + 3];
  }
}
