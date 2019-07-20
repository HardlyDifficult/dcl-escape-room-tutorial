// Export as a function for game.ts to call in order to construct this room
export function CreateRoom1(): void {
  const door = new Entity();
  engine.addEntity(door);

  door.addComponent(new GLTFShape("models/generic/door.glb"));
  door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));

  door.addComponent(new Animator());
  door.getComponent(Animator).addClip(new AnimationState("Open", { looping: false }));

  door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  let isDoorOpen = false;
  door.addComponent(
    new OnClick((): void => {
      if (!isDoorOpen) {
        isDoorOpen = true;
        door.getComponent(Animator).getClip("Open").play();
        door.getComponent(AudioSource).playOnce();
      }
    })
  );
}
