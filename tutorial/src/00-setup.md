# 00: Setup

Primary resource --> https://docs.decentraland.org/

Install NodeJS: https://nodejs.org/en/

```shell
npm i -g decentraland
dcl init
```

Then run:

```shell
dcl start
```

to see the "game" running in your browser.  If you have Metamask installed it will prompt you to connect before the page finishes loading (but it also works without metamask).

It should look something like this:

![Default Scene](./images/defaultScene.png)

Frame rate for debugging in top left

Chat in bottom left.  It actually works when players are connected to the same server.  Try it by using a second tab.

A spinning box in the scene

You can walk (wasd or arrows) around and jump (space).

delete the example contents inside `game.ts` (done in playground)

Add a model:

Add this to `game.ts` (this is the entire file ATM)

```typescript
const baseScene = new Entity()
engine.addEntity(baseScene)

scene.addComponent(new GLTFShape("models/scene.glb"))
```

We also added multiple parcels to the `scene.json`