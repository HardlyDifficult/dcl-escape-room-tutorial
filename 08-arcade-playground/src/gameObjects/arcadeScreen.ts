import utils from "../../node_modules/decentraland-ecs-utils/index";
//import { MouseFollowPathComponent } from "../components/mouseFollowPathComponent";

export class ArcadeScreen {
  public tilesPaintedByPlayer = 0;
  public onCompletion: () => void;

  constructor(
    tileSize: Vector3,
    columnCount: number,
    rowCount: number,
    tileSpacing: Vector3,
    initialPosition: Vector3,
    screenRotation: Quaternion
  ) {
    // Creating Materials
    const miceMaterial = new Material();
    miceMaterial.albedoColor = Color3.Magenta();

    const playerMaterial = new Material();
    playerMaterial.albedoColor = Color3.Green();

    const defaultMaterial = new Material();
    defaultMaterial.albedoColor = Color3.Teal();

    // Creating Screen
    const tileShape = new PlaneShape();
    tileShape.withCollisions = false;

    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < rowCount; row++) {
        // Calculating Tile Position
        let tilePos = new Vector3(
          column * (tileSize.x + tileSpacing.x),
          row * (tileSize.y + tileSpacing.y),
          0
        );
        tilePos = initialPosition.add(tilePos.rotate(screenRotation));

        // Creating Tile Entity
        const tileEntity = new Entity();
        engine.addEntity(tileEntity);

        tileEntity.addComponent(
          new Transform({
            position: tilePos,
            scale: tileSize,
            rotation: screenRotation
          })
        );
        tileEntity.addComponent(tileShape);
        tileEntity.addComponent(defaultMaterial);

        tileEntity.addComponent(
          new OnClick((): void => {
            if (tileEntity.getComponent(Material) != playerMaterial) {
              tileEntity.addComponentOrReplace(playerMaterial);
              this.tilesPaintedByPlayer++;
              if(this.tilesPaintedByPlayer === columnCount * rowCount) {
                this.onCompletion();
              }
            }
          })
        );
        tileEntity.addComponent(
          new utils.TriggerComponent(
            new utils.TriggerBoxShape(
              new Vector3(0.15, 0.15, 0.15),
              Vector3.Zero()
            ),
            2,
            2,
            (entityEnter): void => {
              // TODO if (entityEnter.hasComponent(MouseFollowPathComponent)) {
                //check if the tile was painted by player
                if (tileEntity.getComponent(Material) == playerMaterial) {
                  //decrease tiles painted variable
                  this.tilesPaintedByPlayer--;
                }
                tileEntity.addComponentOrReplace(miceMaterial);
              }
            // }
          )
        );
      }
    }
  }
}
