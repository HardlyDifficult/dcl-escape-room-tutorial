@Component("toggleModelComponent")
export class ToggleModelComponent {
  private onModel: GLTFShape;
  private offModel: GLTFShape;

  constructor(
    lightbulbEntity: IEntity,
    lightOnModel: GLTFShape,
    lightOffModel: GLTFShape
  ) {
    const onEntity = new Entity();
    this.onModel = lightOnModel;

    onEntity.addComponent(this.onModel);
    onEntity.setParent(lightbulbEntity);

    const offEntity = new Entity();
    this.offModel = lightOffModel;

    offEntity.addComponent(this.offModel);
    offEntity.setParent(lightbulbEntity);

    this.setOff();
  }

  setOn(): void {
    this.offModel.visible = false;
    this.onModel.visible = true;
  }

  setOff(): void {
    this.offModel.visible = true;
    this.onModel.visible = false;
  }
}
