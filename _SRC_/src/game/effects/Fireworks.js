import { AnimatedSprite } from "pixi.js";
import { kill } from "../../app/application";
import { atlases } from "../../app/assets";

export default class Fireworks extends AnimatedSprite {
    constructor(x, y) {
        super( atlases.fireworks.animations.A )
        this.points = [{x: x, y: y - 50, a: 'A'}, {x: x - 50, y: y - 70, a: 'B'}, {x: x + 50, y: y - 80, a: 'C'}]
        this.pointIndex = 0
        this.anchor.set(0.5, 1)
        this.animationSpeed = 0.5
        this.position.set(this.points[this.pointIndex].x, this.points[this.pointIndex].y)
        this.alpha = 0.75
        this.blendMode = 'add'
        this.scale.set(1)
        this.loop = false
        this.onComplete = () => this.reset()
        this.play()
    }

    reset() {
        this.pointIndex++
        if (this.pointIndex === this.points.length) return kill(this)

        this.textures = atlases.fireworks.animations[ this.points[this.pointIndex].a ]
        this.position.set(this.points[this.pointIndex].x, this.points[this.pointIndex].y)
        this.onComplete = () => this.reset()
        this.play()
    }
}