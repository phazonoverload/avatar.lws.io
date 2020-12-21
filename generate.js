const { createCanvas, loadImage } = require('canvas')
const fetch  = require('node-fetch')
const fs = require('fs')

const main = async () => {
    try {
        fs.mkdir('avatars', { recursive: true }, (err) => { if(err) throw(err) });
        const gradients = await fetch('https://gitcdn.link/repo/ghosh/uiGradients/master/gradients.json').then(r => r.json())
        for(let gradient of gradients) {
            const size = 400
            const canvas = createCanvas(size, size)
            const ctx = canvas.getContext('2d')

            const canvasGradient = ctx.createLinearGradient(0, 0, size, size)
            console.log(gradient.name)
            for(let [i, c] of gradient.colors.entries()) {
                let color = c.charAt(0) == '#' ? c : '#' + c
                if(i == 0) canvasGradient.addColorStop(0, color)
                if(i > 0 && i < gradient.colors.length) canvasGradient.addColorStop(1 / (gradient.colors.length - 1) * i, color)
                if(i == gradient.colors.length) canvasGradient.addColorStop(1, color)
            }

            ctx.fillStyle = canvasGradient
            ctx.fillRect(0, 0, size, size)
            const baseImg = await loadImage('./base.png')
            ctx.drawImage(baseImg, 0, 0, size, size)

            const filename = gradient.name.toLowerCase().split(' ').join('-').split('&').join('-').split("'").join('')
            const imagePath = `./avatars/${filename}.png`
            const out = fs.createWriteStream(imagePath)
            const stream = canvas.createPNGStream()
            stream.pipe(out)
        }
    } catch(e) {
        console.error(e)
    }
};

main()
