import { Box3, Camera, Matrix4 } from "three";
import { InstancedEntity } from "../InstancedEntity";
import { InstancedMesh2 } from "../InstancedMesh2";
import { Frustum, VisibilityState } from "./Frustum";

export interface Node {
  bbox: Float32Array;
  visibility: VisibilityState;
  left?: Node;
  right?: Node;
  leaves?: InstancedEntity[];
}

export enum SplitType {
  center,
  average,
  SAH,
}

export class InstancedMeshBVH {
  public root: Node;
  protected _target: InstancedMesh2;
  protected _maxLeaves: number;
  protected _maxDepth: number;
  protected _indexes: Uint32Array;
  protected _bboxData: Float32Array;
  protected _frustum = new Frustum();
  protected _show: InstancedEntity[];
  protected _hide: InstancedEntity[];

  constructor(instancedMesh: InstancedMesh2) {
    this._target = instancedMesh;
  }

  public build(
    strategy = SplitType.center,
    maxLeaves = 10,
    maxDepth = 40
  ): this {
    this._maxLeaves = maxLeaves;
    this._maxDepth = maxDepth;

    console.time("setup...");
    const bbox = this.setup();
    console.timeEnd("setup...");

    this.root = { bbox, visibility: VisibilityState.in };

    console.time("bvh...");
    this.buildNode(this.root, 0, this._target.instances.length, 0);
    console.timeEnd("bvh...");

    // delete this._bboxData;
    // delete this._indexes;

    return this;
  }

  private setup(): Float32Array {
    const instances = this._target.instances;
    const count = instances.length;
    const indexes = new Uint32Array(count);
    const bboxData = new Float32Array(count * 6);

    if (!this._target.boundingBox) this._target.computeBoundingBox();
    const bboxGeometry = this._target.geometry.boundingBox;

    let xMinBBox = Infinity;
    let yMinBBox = Infinity;
    let zMinBBox = Infinity;
    let xMaxBBox = -Infinity;
    let yMaxBBox = -Infinity;
    let zMaxBBox = -Infinity;

    for (let i = 0; i < count; i++) {
      indexes[i] = i;

      const bbox = _box.copy(bboxGeometry).applyMatrix4(instances[i].matrix);
      const min = bbox.min;
      const max = bbox.max;

      const i6 = i * 6;
      const xMin = min.x;
      const yMin = min.y;
      const zMin = min.z;
      const xMax = max.x;
      const yMax = max.y;
      const zMax = max.z;

      bboxData[i6] = (xMax + xMin) / 2; // center
      bboxData[i6 + 1] = (xMax - xMin) / 2; // size
      bboxData[i6 + 2] = (yMax + yMin) / 2;
      bboxData[i6 + 3] = (yMax - yMin) / 2;
      bboxData[i6 + 4] = (zMax + zMin) / 2;
      bboxData[i6 + 5] = (zMax - zMin) / 2;

      if (xMinBBox > xMin) xMinBBox = xMin;
      if (yMinBBox > yMin) yMinBBox = yMin;
      if (zMinBBox > zMin) zMinBBox = zMin;
      if (xMaxBBox < xMax) xMaxBBox = xMax;
      if (yMaxBBox < yMax) yMaxBBox = yMax;
      if (zMaxBBox < zMax) zMaxBBox = zMax;
    }

    this._bboxData = bboxData;
    this._indexes = indexes;

    return new Float32Array([
      xMinBBox,
      yMinBBox,
      zMinBBox,
      xMaxBBox,
      yMaxBBox,
      zMaxBBox,
    ]);
  }

  private buildNode(
    node: Node,
    offset: number,
    count: number,
    depth: number
  ): void {
    if (depth++ >= this._maxDepth || count <= this._maxLeaves) {
      node.leaves = this.getLeaves(offset, count);
      return;
    }

    const bbox = node.bbox;
    const axis = this.getLongestAxis(bbox);
    const bboxLeft = new Float32Array(6);
    const bboxRight = new Float32Array(6);
    const center = (bbox[axis] + bbox[axis + 3]) / 2;

    this.createNodes(bboxLeft, bboxRight);

    const leftEndOffset = this.split(
      axis,
      offset,
      count,
      center,
      bboxLeft,
      bboxRight
    );

    if (leftEndOffset === offset || leftEndOffset === offset + count) {
      node.leaves = this.getLeaves(offset, count);
      return;
    }

    node.left = { bbox: bboxLeft, visibility: VisibilityState.in };
    node.right = { bbox: bboxRight, visibility: VisibilityState.in };

    this.buildNode(node.left, offset, leftEndOffset - offset, depth);
    this.buildNode(
      node.right,
      leftEndOffset,
      count - leftEndOffset + offset,
      depth
    );
  }

  private getLeaves(offset: number, count: number): InstancedEntity[] {
    const array = new Array(count);
    const instances = this._target.instances;

    for (let i = 0; i < count; i++) {
      array[i] = instances[this._indexes[offset + i]];
    }

    return array;
  }

  private getLongestAxis(bbox: Float32Array): number {
    const xSize = bbox[3] - bbox[0];
    const ySize = bbox[4] - bbox[1];
    const zSize = bbox[5] - bbox[2];
    if (xSize > ySize) return xSize > zSize ? 0 : 2;
    return ySize > zSize ? 1 : 2;
  }

  private createNodes(bboxLeft: Float32Array, bboxRight: Float32Array): void {
    bboxLeft[0] = Infinity;
    bboxLeft[1] = Infinity;
    bboxLeft[2] = Infinity;
    bboxLeft[3] = -Infinity;
    bboxLeft[4] = -Infinity;
    bboxLeft[5] = -Infinity;

    bboxRight[0] = Infinity;
    bboxRight[1] = Infinity;
    bboxRight[2] = Infinity;
    bboxRight[3] = -Infinity;
    bboxRight[4] = -Infinity;
    bboxRight[5] = -Infinity;
  }

  private split(
    axis: number,
    offset: number,
    count: number,
    center: number,
    bboxLeft: Float32Array,
    bboxRight: Float32Array
  ) {
    const bboxData = this._bboxData;
    const axis2 = axis * 2;
    let left = offset;
    let right = offset + count - 1;

    while (left <= right) {
      if (bboxData[left * 6 + axis2] > center) {
        while (true) {
          if (bboxData[right * 6 + axis2] < center) {
            this.swap(left, right);
            this.unionBBox(right, bboxRight);
            right--;
            break;
          }
          this.unionBBox(right, bboxRight);
          right--;
          if (right < left) return left;
        }
      }
      this.unionBBox(left, bboxLeft);
      left++;
    }

    return left;
  }

  private swap(left: number, right: number): void {
    const bboxData = this._bboxData;
    const index = this._indexes;

    let temp = index[left];
    index[left] = index[right];
    index[right] = temp;

    const left6 = left * 6;
    const right6 = right * 6;

    for (let i = 0; i < 6; i++) {
      temp = bboxData[left6 + i];
      bboxData[left6 + i] = bboxData[right6 + i];
      bboxData[right6 + i] = temp;
    }
  }

  private unionBBox(index: number, bboxSide: Float32Array): void {
    const bbox = this._bboxData;
    const index6 = index * 6;

    const xMin = bbox[index6] - bbox[index6 + 1];
    const xMax = bbox[index6] + bbox[index6 + 1];
    const yMin = bbox[index6 + 2] - bbox[index6 + 3];
    const yMax = bbox[index6 + 2] + bbox[index6 + 3];
    const zMin = bbox[index6 + 4] - bbox[index6 + 5];
    const zMax = bbox[index6 + 4] + bbox[index6 + 5];

    if (bboxSide[0] > xMin) bboxSide[0] = xMin;
    if (bboxSide[1] > yMin) bboxSide[1] = yMin;
    if (bboxSide[2] > zMin) bboxSide[2] = zMin;
    if (bboxSide[3] < xMax) bboxSide[3] = xMax;
    if (bboxSide[4] < yMax) bboxSide[4] = yMax;
    if (bboxSide[5] < zMax) bboxSide[5] = zMax;
  }

  public updateCulling(
    camera: Camera,
    show: InstancedEntity[],
    hide: InstancedEntity[]
  ): void {
    this._show = show;
    this._hide = hide;

    _projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this._frustum.setFromProjectionMatrix(_projScreenMatrix);

    this.checkBoxVisibility(this.root);

    this._show = undefined;
    this._hide = undefined;
  }

  private checkBoxVisibility(node: Node, force?: VisibilityState): void {
    const visibility = force ?? this._frustum.intesectsBox(node.bbox);

    if (
      visibility === VisibilityState.intersect ||
      visibility !== node.visibility
    ) {
      if (node.leaves) {
        if (node.visibility === VisibilityState.out) {
          this._show.push(...node.leaves); // TODO use push for better performance?
        } else if (visibility === VisibilityState.out) {
          this._hide.push(...node.leaves); // TODO use push for better performance?
        }
      } else {
        const force =
          visibility === VisibilityState.intersect ? undefined : visibility;
        this.checkBoxVisibility(node.left, force);
        this.checkBoxVisibility(node.right, force);
      }

      node.visibility = visibility;
    }
  }
}

const _box = new Box3();
const _projScreenMatrix = new Matrix4();
