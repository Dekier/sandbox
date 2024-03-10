import {
  BufferGeometry,
  Camera,
  Color,
  ColorRepresentation,
  DynamicDrawUsage,
  Frustum,
  InstancedBufferAttribute,
  InstancedMesh,
  Material,
  Matrix4,
  Sphere,
  Vector3,
} from "three";
import { InstancedMeshBVH } from "./BVH/InstancedMeshBVH";
import { InstancedEntity } from "./InstancedEntity";

export type CreateEntityCallback<T> = (obj: T, index: number) => void;

export enum Behaviour {
  static,
  dynamic,
}

export interface InstancedMesh2Params<G, M, T> {
  geometry: G;
  material: M;
  count: number;
  color?: ColorRepresentation; // TODO remove?
  onInstanceCreation: CreateEntityCallback<T>;
  behaviour?: Behaviour;
  perObjectFrustumCulled?: boolean;
  // createEntities?: boolean;
}

export class InstancedMesh2<
  T extends InstancedEntity = InstancedEntity,
  G extends BufferGeometry = BufferGeometry,
  M extends Material = Material
> extends InstancedMesh<G, M> {
  public declare type: "InstancedMesh2";
  public declare isInstancedMesh2: true;
  public instances: T[];
  /** @internal */ public _perObjectFrustumCulled = true;
  /** @internal */ public _internalInstances: T[];
  private _behaviour: Behaviour;
  private _bvh: InstancedMeshBVH;
  private _instancedAttributes: InstancedBufferAttribute[];

  constructor(params: InstancedMesh2Params<G, M, T>) {
    if (params === undefined) throw new Error("params is mandatory");
    if (params.geometry === undefined) throw new Error("geometry is mandatory");
    if (params.material === undefined) throw new Error("material is mandatory");
    if (params.count === undefined) throw new Error("count is mandatory");
    if (params.onInstanceCreation === undefined)
      throw new Error("onInstanceCreation is mandatory");

    super(params.geometry, params.material, params.count);

    const count = params.count;
    const color =
      params.color !== undefined ? _color.set(params.color) : undefined;
    const onInstanceCreation = params.onInstanceCreation;
    this._behaviour = params.behaviour ?? Behaviour.static;

    this.instances = new Array(count);
    this._internalInstances = new Array(count);

    console.time("instancing...");

    for (let i = 0; i < count; i++) {
      const instance = new InstancedEntity(this, i, color) as T;

      onInstanceCreation(instance, i);
      instance.forceUpdateMatrix();

      this._internalInstances[i] = instance;
      this.instances[i] = instance;
    }

    console.timeEnd("instancing...");

    // TODO fare update in base alle visibilità se onCreateEntity

    if (this._perObjectFrustumCulled) {
      this.updateInstancedAttributes();
      this.frustumCulled = false; // todo gestire a true solamente quando count è 0 e mettere bbox

      if (this._behaviour === Behaviour.static) {
        this._bvh = new InstancedMeshBVH(this).build();
      }
    }
  }

  private updateInstancedAttributes(): void {
    const instancedAttributes = [this.instanceMatrix];
    this.instanceMatrix.setUsage(DynamicDrawUsage);

    if (this.instanceColor) {
      instancedAttributes.push(this.instanceColor);
      this.instanceColor.setUsage(DynamicDrawUsage);
    }

    const attributes = this.geometry.attributes;
    for (const key in attributes) {
      const attr = attributes[key] as InstancedBufferAttribute;
      if ((attr as any).isInstancedBufferAttribute) {
        // TODO FIX d.ts and remove any
        attr.setUsage(DynamicDrawUsage);
        instancedAttributes.push(attr);
      }
    }

    this._instancedAttributes = instancedAttributes;
  }

  /** @internal */
  public setInstanceVisibility(instance: T, value: boolean): void {
    if (
      value ===
      (instance._visible &&
        (!this._perObjectFrustumCulled || instance._inFrustum))
    )
      return;
    if (value === true) {
      this.swapInstance(instance, this.count);
      this.count++;
    } else {
      this.swapInstance(instance, this.count - 1);
      this.count--;
    }
    this.needsUpdate(); // serve?
  }

  private setInstancesVisibility(show: T[], hide: T[]): void {
    const hideLengthMinus = hide.length - 1;
    const length = Math.min(show.length, hide.length);

    for (let i = 0; i < length; i++) {
      this.swapInstance2(show[i], hide[hideLengthMinus - i]);
    }

    this.needsUpdate(); // TODO usare anche altrove

    if (show.length === hide.length) return;

    if (show.length > hide.length) this.showInstances(show, length);
    else this.hideInstances(hide, hide.length - length);
  }

  private showInstances(entities: T[], count: number): void {
    let startIndex = count;
    let endIndex = entities.length - 1;

    while (endIndex >= startIndex) {
      this.swapInstance(entities[endIndex], this.count);
      endIndex--;
      this.count++;
    }
  }

  private hideInstances(entities: T[], count: number): void {
    let startIndex = 0;
    let endIndex = count - 1;

    while (endIndex >= startIndex) {
      this.swapInstance(entities[startIndex], this.count - 1);
      startIndex++;
      this.count--;
    }
  }

  private swapInstance(instanceFrom: T, idTo: number): void {
    const instanceTo = this._internalInstances[idTo];
    if (instanceFrom === instanceTo) return; //TODO ottimizzare per non farlo capitare?
    const idFrom = instanceFrom._internalId;

    this.swapAttributes(idFrom, idTo);

    const temp = instanceTo.matrixArray;
    instanceTo.matrixArray = instanceFrom.matrixArray;
    instanceFrom.matrixArray = temp;

    instanceTo._internalId = idFrom;
    instanceFrom._internalId = idTo;

    this._internalInstances[idTo] = instanceFrom;
    this._internalInstances[idFrom] = instanceTo;
  }

  private swapInstance2(instanceFrom: T, instanceTo: T): void {
    // if (instanceFrom === instanceTo) return this // this is always false in the only scenario when it's used
    const idFrom = instanceFrom._internalId;
    const idTo = instanceTo._internalId;

    this.swapAttributes(idFrom, idTo);

    const temp = instanceTo.matrixArray;
    instanceTo.matrixArray = instanceFrom.matrixArray;
    instanceFrom.matrixArray = temp;

    this._internalInstances[idTo] = instanceFrom;
    this._internalInstances[idFrom] = instanceTo;

    instanceTo._internalId = idFrom;
    instanceFrom._internalId = idTo;
  }

  private swapAttributes(idFrom: number, idTo: number): void {
    for (const attr of this._instancedAttributes) {
      this.swapAttribute(attr, idTo, idFrom);
    }
  }

  private swapAttribute(
    attr: InstancedBufferAttribute,
    from: number,
    to: number
  ): void {
    const array = attr.array;
    const size = attr.itemSize;
    const fromOffset = from * size;
    const toOffset = to * size;

    const temp = array[fromOffset];
    array[fromOffset] = array[toOffset];
    array[toOffset] = temp;
    for (let i = 1; i < size; i++) {
      const temp = array[fromOffset + i];
      array[fromOffset + i] = array[toOffset + i];
      array[toOffset + i] = temp;
    }
  }

  public updateCulling(camera: Camera): void {
    //put it on beforeRenderer

    if (this._perObjectFrustumCulled === false) return;

    const show: T[] = []; // opt memory allocation
    const hide: T[] = [];

    // console.time("culling");

    if (this._behaviour === Behaviour.static) {
      this._bvh.updateCulling(camera, show, hide);
    } else {
      this.checkDynamicFrustum(camera, show, hide);
    }

    // console.timeEnd("culling");

    if (show.length > 0 || hide.length > 0)
      this.setInstancesVisibility(show, hide);
  }

  private checkDynamicFrustum(camera: Camera, show: T[], hide: T[]): void {
    _projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    _frustum.setFromProjectionMatrix(_projScreenMatrix);

    const instances = this.instances;
    const bSphere = this.geometry.boundingSphere;
    const radius = bSphere.radius;
    const center = bSphere.center;

    for (let i = 0, l = this.instances.length; i < l; i++) {
      const instance = instances[i];
      if (instance._visible === false) continue;

      // _sphere.center.copy(center).applyQuaternion(instance.quaternion).add(instance.position);

      _sphere.center.addVectors(center, instance.position); // this works if geometry bsphere center is 0,0,0
      _sphere.radius = radius * this.getMax(instance.scale);

      if (
        instance._inFrustum !==
        (instance._inFrustum = _frustum.intersectsSphere(_sphere))
      ) {
        if (instance._inFrustum === true) show.push(instance);
        else hide.push(instance);
      }

      if (instance._inFrustum && instance._matrixNeedsUpdate) {
        instance.forceUpdateMatrix();
      }
    }
  }

  // this is faster than Math.max(scale.x, scale.y, scale.z)
  private getMax(scale: Vector3): number {
    if (scale.x > scale.y) return scale.x > scale.z ? scale.x : scale.z;
    return scale.y > scale.z ? scale.y : scale.z;
  }

  private needsUpdate(): void {
    for (const attr of this._instancedAttributes) {
      attr.needsUpdate = true; // capire
      attr.addUpdateRange(0, this.count * attr.itemSize);
    }
  }
}

InstancedMesh2.prototype.isInstancedMesh2 = true;
InstancedMesh2.prototype.type = "InstancedMesh2";

const _color = new Color();
const _frustum = new Frustum();
const _projScreenMatrix = new Matrix4();
const _sphere = new Sphere();

// TODO not swap matrix if needsUpdate = true ?
// TODO creare un altro metodo di needUpdate se cambia colore
