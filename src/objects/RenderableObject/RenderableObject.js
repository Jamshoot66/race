export default class RenderableObject {
  _mesh = null;

  get mesh() {
    if (!this._mesh) throw new Error('mesh is not implemented');
    return this._mesh;
  }

  set mesh(mesh) {
    this._mesh = mesh;
  }

  constructor(type = '') {
    this.type = type;
  }
  // eslint-disable-next-line no-unused-vars
  update = (deltaTime) => {};
}
