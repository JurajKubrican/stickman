/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';
import {
    Engine,
    Render,
    World,
    Bodies,
    Body,
    Constraint, Composite
} from "matter-js";

import Controller from "node-pid-controller";


// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine
});

const manX = 300;
const manY = 500;
const ctr = new Controller({
    k_p: 0.55,
    k_i: 0.00,
    k_d: 0.20,
    dt: 1
});
// create two boxes and a ground
const body = Bodies.rectangle(manX, manY - 107, 40, 40);
const stick = Bodies.rectangle(manX, manY - 45, 2, 80);
const wheel = Bodies.circle(manX, manY - 5, 10);
const bodyContraint = Constraint.create({
    bodyA: stick,
    pointA: {x: 0, y: -40},
    bodyB: body,
    pointB: {x: 0, y: 22},
    length: 0,
    stiffness: 1,
    damping: 0,
});
const bodyContraint2 = Constraint.create({
    bodyA: stick,
    pointA: {x: 0, y: 40},
    bodyB: body,
    pointB: {x: 0, y: -20},
    length: 122,
    stiffness: 1,
    damping: 0,
});
const wheelConstraint = Constraint.create({
    bodyA: stick,
    pointA: {x: 0, y: 53},
    bodyB: wheel,
    pointB: {x: 0, y: 0},
    length: 0,
    damping: 0.5,
    stiffness: 1,
});


const stickman = Composite.create();
Composite.add(stickman, stick);
Composite.add(stickman, body);
Composite.add(stickman, wheel);
Composite.add(stickman, bodyContraint);
Composite.add(stickman, bodyContraint2);
Composite.add(stickman, wheelConstraint);

let mouseX = 300;
onmousemove = function (e) {
    mouseX = e.clientX;
};

setInterval(() => {
    console.log(stick.angle);
    const angle = stick.angle + mouseX < 300 ? stick.angle - .05 : mouseX > 310 ? stick.angle + .05 : stick.angle;
    const v = ctr.update(angle);
    Body.setAngularVelocity(wheel, -v * 10);
}, 3);

const ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true});

// add all of the bodies to the world
World.add(engine.world, [stickman, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
