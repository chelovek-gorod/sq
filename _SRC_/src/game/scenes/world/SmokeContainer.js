import { AnimatedSprite, Container } from "pixi.js";
import { atlases } from "../../../app/assets";
import { MAP_HALF_HEIGHT, MAP_HALF_WIDTH } from "./constants";

const points = [
    {x: -MAP_HALF_WIDTH + 612, y: -MAP_HALF_HEIGHT + 876},
    {x: -MAP_HALF_WIDTH + 634, y: -MAP_HALF_HEIGHT + 864},
    {x: -MAP_HALF_WIDTH + 641, y: -MAP_HALF_HEIGHT + 884},
    {x: -MAP_HALF_WIDTH + 658, y: -MAP_HALF_HEIGHT + 872},
    {x: -MAP_HALF_WIDTH + 667, y: -MAP_HALF_HEIGHT + 860},
    {x: -MAP_HALF_WIDTH + 675, y: -MAP_HALF_HEIGHT + 875},
    {x: -MAP_HALF_WIDTH + 691, y: -MAP_HALF_HEIGHT + 861},
]
for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]]
}

class Smoke extends AnimatedSprite {
    constructor(x, y, startIndex) {
        super(atlases.smoke.animations.go)
        
        this.animationSpeed = 0.5
        this.onLoop = this.restart.bind(this)
        this.gotoAndPlay(startIndex)

        this.blendMode = 'screen'

        this.anchor.set(0.5)
        this.position.set(x, y)
        this.rotation = Math.random() * (Math.PI * 2)
        this.scale.set( 0.25 + Math.random() * 0.25 )
        this.alpha = 0.5 + Math.random() * 0.5
    }

    restart() {
        this.rotation = Math.random() * (Math.PI * 2)
        this.scale.set( 0.25 + Math.random() * 0.25 )
        this.alpha = 0.5 + Math.random() * 0.5
    }
}

export default class SmokeContainer extends Container {
    constructor() {
        super()

        for (let i = points.length - 1; i >= 0; i--) {
            this.addChild( new Smoke(points[i].x, points[i].y, i * 2) )
        }
    }
}