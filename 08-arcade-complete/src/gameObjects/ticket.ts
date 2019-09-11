import resources from "../resources";

export class Ticket extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.ticket);
    this.addComponent(new Transform(transform));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Ticket_Action", { looping: false })
    );
  }

  AnimateTicket(): void {
    this.getComponent(Animator)
      .getClip("Ticket_Action")
      .play();
  }
}
