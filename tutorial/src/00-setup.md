# 00: Setup

Primary resource --> https://docs.decentraland.org/

Install NodeJS

```
npm init
npm i -g decentraland
dcl init
```

Then run:

```
dcl start
```

to see the "game" running in your browser.  If you have Metamask installed it will prompt you to connect before the page finishes loading (but it also works without metamask).

It should look something like this:

![Default Scene](./images/defaultScene.png)

Frame rate for debugging in top left

// new feature with the latest version of the CLI:
Click P to view a panel with other useful information about your scene, including triangle count, material count, etc.

Chat in bottom left.  It actually works when players are connected to the same server.  Try it by using a second tab.

A spinning box in the scene

You can walk (wasd or arrows) around and jump (space).

// the `dcl start` command will very soon support hot-reloading on its own, it won't be necessary to explain that workaround, let's keep it simple :)

delete the example contents inside `game.ts` (done in playground)

Add a model:

Add this to `game.ts` (this is the entire file ATM)

```
const scene = new Entity()
scene.addComponent(new GLTFShape("models/scene.glb"))
scene.addComponent(new Transform({rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(scene)
```
