import { AnimatedSprite } from "pixi.js";
import { kill } from "../../app/application";
import { atlases } from "../../app/assets";

export default class Splash extends AnimatedSprite {
    constructor(x, y) {
        super( atlases.splash_2.animations.go )
        this.anchor.set(0.5, 0.5)
        this.animationSpeed = 0.5
        this.position.set(x, y)
        this.alpha = 1
        this.scale.set(2)
        this.loop = false
        this.onComplete = () => kill(this)
        this.play()
    }
}