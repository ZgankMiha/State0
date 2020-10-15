function ledstripe () {
    if (ledUnlocked == -1) {
        strip.showColor(neopixel.hsl(250, 100, 0))
    } else if (ledUnlocked == 0) {
        strip.showColor(neopixel.hsl(5, 100, 50))
    }
}
function game2 (counter: number) {
    if (startGame) {
        if (gameRoundCounter == 0) {
            gameRoundCounter = counter * 3
        }
        if (buttonToPress == -1) {
            buttonToPress = randint(0, 1)
        }
        if (buttonToPress == 0) {
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
            if (aPressed) {
                aPressed = false
                gameRoundCounter += -1
                buttonToPress = -1
                if (!(gameRoundCounter)) {
                    startGame = false
                    ledUnlocked = 1
                    ledGreen()
                }
                basic.showLeds(`
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
                basic.pause(100)
            }
        } else if (buttonToPress == 1) {
            basic.showLeds(`
                . . # . .
                . . . # .
                # # # # #
                . . . # .
                . . # . .
                `)
            if (bPressed) {
                bPressed = false
                gameRoundCounter += -1
                buttonToPress = -1
                if (!(gameRoundCounter)) {
                    startGame = false
                    ledUnlocked = 1
                    ledGreen()
                }
                basic.showLeds(`
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    . . . . .
                    `)
                basic.pause(100)
            }
        }
    }
}
input.onButtonPressed(Button.A, function () {
    aPressed = true
})
function timer () {
    now = input.runningTime()
    timePassed = now - lastTriger
    if (timePassed >= interval) {
        lastTriger = input.runningTime()
        gameRoundCounter = 0
        counter = 0
        buttonToPress = -1
        startGame = false
        ledUnlocked = -1
        ledstripe()
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
}
input.onButtonPressed(Button.AB, function () {
    startGame = true
})
function ledGreen () {
    if (ledUnlocked == 1) {
        strip.showColor(neopixel.hsl(120, 100, 50))
    }
}
input.onButtonPressed(Button.B, function () {
    bPressed = true
})
function checkOpeningState () {
    currentReading = Math.constrain(Math.map(pins.analogReadPin(AnalogPin.P0), threshold, 1023, 0, 1023), 0, 1023)
    serial.writeValue("light", currentReading)
    if (!(open) && currentReading != 0) {
        open = true
        ledUnlocked = -1
        serial.writeLine("opened")
        counter += 1
    } else if (open && currentReading == 0) {
        open = false
        ledUnlocked = 0
        startGame = true
        lastTriger = input.runningTime()
        serial.writeLine("closed")
    }
}
let open = false
let currentReading = 0
let ledUnlocked = 0
let strip: neopixel.Strip = null
let threshold = 0
let bPressed = false
let aPressed = false
let buttonToPress = 0
let gameRoundCounter = 0
let counter = 0
let startGame = false
let lastTriger = 0
let interval = 0
let timePassed = 0
let now = 0
now = 0
timePassed = 0
interval = 3600000
lastTriger = 0
let lastReading = 0
startGame = false
counter = 0
gameRoundCounter = 0
buttonToPress = -1
aPressed = false
bPressed = false
threshold = 50
strip = neopixel.create(DigitalPin.P1, 30, NeoPixelMode.RGB)
ledUnlocked = -1
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    timer()
    checkOpeningState()
    ledstripe()
    game2(counter)
})
