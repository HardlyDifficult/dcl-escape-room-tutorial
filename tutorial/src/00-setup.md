# 00: Setup

Resources:
 - Documentation: https://docs.decentraland.org/
 - NodeJS: https://nodejs.org/en/
 - Complete example repo: [00-setup-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/00-setup-complete)

## Getting Started

Navigate to an empty folder you want to work in, open a command prompt or Powershell window and run the following:

```shell
npm i -g decentraland
dcl init
```

And then run the following to see the "game" running in your browser:

```shell
dcl start
```

It should look something like this:

![Default Scene](./images/defaultScene.png)

Frame rate for debugging in top left

Chat in bottom left.  It actually works when players are connected to the same server.  Try it by using a second tab.

A spinning box in the scene

You can walk (wasd or arrows) around and jump (space).

## Add a model

First we'll need the model itself, you can copy `models/scene.glb` from one of our example scenes.

Delete the example contents inside `game.ts` and then type the following:

```typescript
// Create an entity for the main scene model
const baseScene = new Entity();

// Add it to the engine for rendering
engine.addEntity(baseScene);

// Give it a component for the model itself
baseScene.addComponent(new GLTFShape("models/scene.glb"));
```

## Configure the scene

The house we are working in spans several parcels of land.  Update `scene.json` to include multiple parcels as seen here:

```json
"parcels": [
    "0,0","1,0","0,1","1,1","1,2","0,2","2,0","2,1","2,2"
]
```