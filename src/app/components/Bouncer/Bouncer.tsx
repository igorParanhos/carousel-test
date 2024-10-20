'use client'

import styles from './Bouncer.module.css';
import { useEffect, useRef } from "react";

enum State {
  IDLE,
  PLAYING,
  STOPED,
}

interface Object {
  x: number;
  y: number;
  mass: number;
  colour: string;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

class Ball implements Object {
  x: number;
  y: number;
  mass: number;
  radius: number;
  colour: string;
  constructor(
    x: number,
    y: number,
    radius: number,
    mass: number = 1,
    colour: string = "#f0f909"
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.colour = colour;
  }
  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  };
}

class BouncerController {
  _canvas: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D;
  _rafId: number|undefined;
  state: State = State.IDLE;
  objs: Object[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d")!;
    console.log(0, 0, this._canvas.width, this._canvas.height);
  }

  addObject = (objs: Object[]) => {
    this.objs = this.objs.concat(objs);
  }

  removeObject = (obj: Object) => {
    this.objs = this.objs.filter((o) => o !== obj)
  }

  tick = () => {
    if (this.state === State.PLAYING)  {
      this._rafId = requestAnimationFrame(this.tick);
    }

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.objs.forEach((item) => {
      item.draw(this._ctx);
    });
  }

  start = () => {
    this.state = State.PLAYING;
    this.tick();
  }

  stop = () => {
    this.state = State.STOPED;
    cancelAnimationFrame(this._rafId as number)
    this._rafId = undefined;
  }
}

enum ObjectType {
  DYNAMIC,
  STATIC
}

const globalObjs: Objects = [];
class PhysicsWrapperObject implements Object {
  _obj: Object;
  _type: ObjectType;
  x: number = 0;
  y: number = 0;
  mass: number = 0;
  colour: string= '';
  constructor(obj: Object, type: ObjectType) {
    this._obj = obj;
    this._type = type;
    globalObjs.push(this);
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    this._obj.x = this._obj.x;
    this._obj.y = this._obj.y + 1;
    this._obj.draw(ctx)
  }
}

const withPhysicsWrapper = (obj: Object, type: ObjectType) => {
  return new PhysicsWrapperObject(obj, type);
}

interface BouncerProps {}
export const Bouncer: React.FC<BouncerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const canvas = canvasRef.current;
    const controller = new BouncerController(canvas);
    controller.start();
    controller.addObject([withPhysicsWrapper(new Ball(100, 100, 50), ObjectType.DYNAMIC)])
    return () => {
      controller.stop();
    }
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} width={800} height={800} />;
};
