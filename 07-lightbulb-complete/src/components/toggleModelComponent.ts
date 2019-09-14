@Component("toggleModelComponent")
export class ToggleModelComponent {
  private onModel: GLTFShape;
  private offModel: GLTFShape;

  constructor(entity: IEntity, onModel: GLTFShape, offModel: GLTFShape) {
    this.onModel = new GLTFShape(onModel.src);
    const onEntity = new Entity();
    onEntity.addComponent(this.onModel);
    onEntity.setParent(entity);

    this.offModel = new GLTFShape(offModel.src);
    const offEntity = new Entity();
    offEntity.addComponent(this.offModel);
    offEntity.setParent(entity);

    this.setOff();
  }

  setOn() {
    this.offModel.visible = false;
    this.onModel.visible = true;
  }

  setOff() {
    this.onModel.visible = false;
    this.offModel.visible = true;
  }
}
