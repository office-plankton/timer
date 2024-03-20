class ChangingBackground {
    constructor() {
        this.bgImageTop = document.getElementById('bgImageTop');
        this.bgImageBottom = document.getElementById('bgImageBottom');

        const src = this.getRandomSrc();
        this.searchImg(this.bgImageTop, src);
        this.run();
    }

    run() {
        setInterval(() => {
            const src = this.getRandomSrc();
            this.searchImg(this.bgImageBottom, src);

            // Change Opacity
            let count = 10;
            let timer = setInterval(() => { 
                if (count === 0) {
                    this.bgImageTop.src = this.bgImageBottom.src;
                    this.bgImageTop.style.opacity = 1; 
                    clearInterval(timer);
                } else {
                    this.bgImageTop.style.opacity = count / 10; 
                    count--;
                }
            }, 80);
        }, 6500); 
    }

    searchImg(img, src) {
        img.onload = () => {
            img.onload = null;
            img.onload = null;
        }

        img.onerror = () => {
            console.clear();
            img.src = `${ src }.png`;
            img.onerror = null;
        }

        img.src = `${ src }.jpg`;
    }

    getRandomSrc() {
        const photos = 3;
        const path = './images/';
        const rand = Math.floor(1 + Math.random() * photos);
        return path + rand;
    }
}

class InputWidthByContent {
    constructor (input) {
        this.input = input;

        this.width = document.createElement('div');
        this.width.classList.add('counter-width');
        this.input.parentNode.appendChild(this.width);

        this.input.addEventListener('input', () => this.countWidth());
        this.countWidth();
    }

    countWidth() {
        this.width.textContent = this.input.value;
        this.input.style.width = this.width.clientWidth + 2 + 'px';
    }

    setValue(value) {
        this.input.value = value;
        this.countWidth();
    }
}

class PausePlayButton {
    constructor () {
        this.play = document.getElementById('play');
        this.pause = document.getElementById('pause');
    }
    
    showPlay() {
        this.play.classList.remove('active');
        this.pause.classList.add('active');
    }

    showPause() {
        this.pause.classList.remove('active');
        this.play.classList.add('active');
    }

    showPlayIsActive() {
        return this.play.classList.contains('active');
    }
}

class Title {
    constructor(hoursInput, minutesInput) {
        this.title = document.getElementById('title');
        this.minutesInput = minutesInput;
        this.hoursInput = hoursInput;
    }

    change() {
        const hours = this.hoursInput.value;
        const minutes = this.minutesInput.value;
        this.title.textContent = `${ hours }:${ minutes }`;
    }

    setDefault() {
        this.title.textContent = 'Timer';
    }
}

class TimeTrigger {
    timer;
    
    constructor() { this.timechange = new Event('timechange'); }

    connect(callback) { 
        document.addEventListener("timechange", callback);
    }

    run() {
        this.timer = setInterval(() => {
            document.dispatchEvent(this.timechange);
        }, 60000); // 60000 -> 3000
    }

    stop() { clearInterval(this.timer); }
}

function insertCursor(hours, minutes) {
    
    // ↓
    document.addEventListener("keydown", (e) => {
        const key = e.keyCode || e.which;
        if (key === 40) {
            e.stopImmediatePropagation();
            e.preventDefault();
            hours.focus();
            hours.setSelectionRange(1, 1);
        }
    });

    // ↑
    document.addEventListener("keydown", (e) => {
        const key = e.keyCode || e.which;
        if (key === 38) {
            e.stopImmediatePropagation();
            e.preventDefault();
            minutes.focus();
            minutes.setSelectionRange(1, 1);
        }
    });

    // ←
    minutes.addEventListener('keydown', (e) => {
        const key = e.keyCode || e.which;
        if (key !== 37) return;
        
        if (minutes.selectionStart === 1 || minutes.selectionStart === 0) {
            e.preventDefault();
            hours.focus();
            hours.setSelectionRange(hours.value.length, hours.value.length);
        }
    });

    // →
    hours.addEventListener('keydown', (e) => {
        const key = e.keyCode || e.which;
        if (key !== 39) return;
        
        if (hours.value.length === hours.selectionStart) {
            e.preventDefault();
            minutes.focus();
            minutes.setSelectionRange(1, 1);
        }
    });
} 

class Validator {

    numerator() {
        const minutes = document.getElementById('minutes').value;
        const hours = document.getElementById('hours').value;

        const isZero = parseInt(minutes) === 0 && parseInt(hours) === 0;
        const isEmpty = minutes === '' || hours === '';

        if (isZero || isEmpty) return false;
        return true;
    }

    counter(input) {
        const max = parseInt(input.getAttribute("max"));

        input.addEventListener('keydown', (e) => {
            const key = e.keyCode || e.which;

            // Is number or arrows
            const stop = (key < 48 || key > 57) && key !== 8 && key !== 37 && key !== 39;
            if (stop) { 
                e.preventDefault();
                return;
            }
            
            // New Value < max
            const isBackspace = e.key === 'Backspace';
            let newValue = '';
            switch (true) {
                case !isBackspace && e.target.selectionStart === 0: 
                        newValue = parseInt(`${ e.key }${ input.value }`); 
                    break;
                case !isBackspace && e.target.selectionStart === 1: 
                        newValue = parseInt(`${ input.value }${ e.key }`); 
                    break;
                case isBackspace && e.target.selectionStart === 1:  
                        newValue = parseInt(input.value[1]); 
                    break;
                case isBackspace && e.target.selectionStart === 2:  
                        newValue = parseInt(input.value[0]); 
                    break;
            }

            if (newValue > max) e.preventDefault();
        });
    }
}

class MinutesCounter {
    constructor(minutes) {
        this.minutes = minutes;
        this.input = minutes.input;

        this.input.addEventListener('blur', () => {
            if (this.input.value === '') {
                minutes.setValue('00');
                return;
            }

            let value = parseInt(this.input.value);
            if (value < 10) {
                value = `0${value}`;
                minutes.setValue(value);
            }
        });
    }

    checkExistenceZero() {
        if (this.input.value.length === 1) {
            this.minutes.setValue(`0${ this.input.value }`);
        }
    }
}

class HoursCounter {
    constructor(hours) {
        this.hours = hours;
        this.input = hours.input;

        this.input.addEventListener('blur', () => {
            if (this.input.value === '') {
                hours.setValue('0');
            }
        });
    }

    getValue() {
        const value = this.input.value;
        if (value === '') return ''; 
        return parseInt(value);
    }
}

function switcherEvents(pausePlayBtn, hours, minutes, switcher) {

    // Pause Play Button 
    pausePlayBtn.play.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        switcher.run();
    });
    pausePlayBtn.pause.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        switcher.pause();
    });

    // Space
    document.addEventListener("keydown", (e) => {
        const key = e.keyCode || e.which;

        if (key === 32) {
            e.stopImmediatePropagation();
            e.preventDefault();

            if (pausePlayBtn.showPlayIsActive()) {
                switcher.run();
                return;
            }

            switcher.pause();
        }
    });

    // Enter
    const enter = (e) => {
        const key = e.keyCode || e.which;

        if (key === 13) {
            e.preventDefault();
            e.stopImmediatePropagation();
            switcher.run();
        }
    }
    minutes.addEventListener('keydown', enter);
    hours.addEventListener('keydown', enter);
}

class Switcher {    
    constructor(pausePlayButton, timer, title, hoursCounter, minutesCounter, validator) {
        this.pausePlayButton = pausePlayButton;
        this.timer = timer;
        this.title = title;
        this.hoursCounter = hoursCounter;
        this.minutesCounter = minutesCounter;
        this.validator = validator;
    }

    run () {
        if (this.validator.numerator() && this.pausePlayButton.showPlayIsActive()) {
            this.play();
        }
    }

    play() {
        this.minutesCounter.checkExistenceZero();
        this.pausePlayButton.showPlay();
        this.timer.run();
        this.title.change();
    }

    pause() {
        this.pausePlayButton.showPause();
        this.timer.stop();
        this.title.setDefault();
    }

    end() {
        this.hoursCounter.hours.setValue(this.hoursCounter.input.getAttribute('value'));
        this.minutesCounter.minutes.setValue(this.minutesCounter.input.getAttribute('value'));
        this.pausePlayButton.showPause();
        this.timer.stop();
        this.title.setDefault();
    }
}

class Numerator {
    constructor(timerTrigger, hours, minutes, hoursCounter, title, switcher) {
        this.hours = hours;
        this.minutes = minutes;
        this.hoursInput = hours.input;
        this.minutesInput = minutes.input;

        this.audio = document.getElementById("audio");
      
        timerTrigger.connect(() => {
            const minutes = this.minusMinute();

            if (minutes === 0 && hoursCounter.getValue() === 0) {
                switcher.end();
                this.audio.play();
                title.setDefault();
                return;
            }

            if (minutes === 59) {
                this.minusHour();
                title.change();
                return;
            } 
            
            title.change(); 
        });
    }

    minusMinute() {
        if (this.minutesInput.value === '') return false;

        const actual = parseInt(this.minutesInput.value);
        let next = null;
        switch (true) {
            case actual === 0: next = 59; break;
            case actual - 1 < 10: next = `0${ actual - 1 }`; break;
            default: next = actual - 1;
        }

        this.minutes.setValue(next);
        next = parseInt(next);
        return next;
    }

    minusHour() {
        if (this.hoursInput.value === '') return false;

        const actual = parseInt(this.hoursInput.value);
        let next = actual - 1;;

        this.hours.setValue(next);
        return next;
    }
}

const background = new ChangingBackground();

const minutesInput = document.getElementById('minutes');
const hoursInput = document.getElementById('hours');

const minutes = new InputWidthByContent(minutesInput); 
const hours = new InputWidthByContent(hoursInput); 

const minutesCounter = new MinutesCounter(minutes); 
const hoursCounter = new HoursCounter(hours); 

const validator = new Validator();
validator.counter(minutesInput);
validator.counter(hoursInput);

const pausePlayButton = new PausePlayButton();
const timerTrigger = new TimeTrigger();
const title = new Title(hoursInput, minutesInput);

const switcher = new Switcher(pausePlayButton, timerTrigger, title, hoursCounter, minutesCounter, validator);
const numerator = new Numerator(timerTrigger, hours, minutes, hoursCounter, title, switcher);
switcherEvents(pausePlayButton, hoursInput, minutesInput, switcher);

insertCursor(hoursInput, minutesInput);
