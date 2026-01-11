import { TextStyle, FillGradient } from "pixi.js"
import { fonts } from "./assets"

const fillSubtitleGradient = new FillGradient({
    type: 'linear',
    colorStops: [
      { offset: 0,    color: '#ffffff' },
      { offset: 0.25, color: '#87fff7' },
      { offset: 0.5,  color: '#40ffcf' },
      { offset: 0.75, color: '#87fff7' },
      { offset: 1,    color: '#ffffff' },
    ],
});

export let styles = {
    isReady: false, /* if true -> fonts is already loaded */

    /* Font keys (init all fonts in function bellow) */
    loading: null,
    gameTitle: null,
    gameSubtitle: null,
    button: null,
    buttonHover: null,
}

export function initFontStyles() {
    styles.loading = new TextStyle({
        fontFamily: fonts.BSRegular,
        fontSize: 48,
        fill: '#ffffff',
    
        dropShadow: true,
        dropShadowColor: '#00ff00',
        dropShadowBlur: 4,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })

    styles.gameTitle = new TextStyle({
        fontFamily: fonts.RubikDirt,
        fontSize: 128,
        fill: '#ffffff',

        stroke: {
            color: '#33ffff',
            width: 16
        }
    })
    styles.gameSubtitle = new TextStyle({
        fontFamily: fonts.RubikGemstones,
        fontSize: 72,
        fill: fillSubtitleGradient,
    })

    styles.button = new TextStyle({
        fontFamily: fonts.BSBold,
        fontSize: 60,
        fill: '#ffffff',
    })
    styles.buttonHover = new TextStyle({
        fontFamily: fonts.BSBold,
        fontSize: 60,
        fill: '#ffffff',
    
        dropShadow: true,
        dropShadowColor: '#770077',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })

    styles.isReady = true

    // EXAMPLES
    /*
    gradientText: new TextStyle({
        fontFamily: fonts.RobotoBlack,
        fontSize: 32,
        fill: '#000000',

        align: 'center',
        
        wordWrap: true,
        wordWrapWidth: 440,
        //breakWords: true,
        lineJoin: 'round',

        stroke: {
            color: 0x000000,
            width: 2
        }

        dropShadow: true,
        dropShadowColor: '#ffffff',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,

        wordWrap: true,
        wordWrapWidth: 400,
    }),
    */
}