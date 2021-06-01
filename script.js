class Slider {

    constructor(sliderId = "slider") {
        this.slider = document.getElementById(sliderId);
        this.sliderContainer = this.slider.querySelector(".slider-container");
        this.prevButton = this.slider.querySelector('.button-left');
        this.nextButton = this.slider.querySelector('.button-right');
        this.interval = this.slider.getAttribute('data-interval') || 3000;
        this.progressbar = this.slider.querySelector('.progressBar');
        console.log(this.sliderContainer);

        /* Attributes */
        this.currentSlide = 0;
        this.currentPosition = 0;
        this.dragging = false;
        this.timer = null;
        this.transformValue = 0;
        this.progressBarTimer = null;
        this.progressBarWidth= 0;

        /* Options */
        this.effectiveTransform =  400;
        this.totalSlides = this.sliderContainer.childElementCount;
        this.windowSize = this.totalSlides * window.innerWidth;
        this.sliderContainer.style.width = `${this.windowSize}px`;

        /* Functionality */
        this.slider.onmousedown = this.startDrag.bind(this);
        this.slider.onmousemove = this.whileDragging.bind(this);
        this.slider.onmouseup = this.endDrag.bind(this);
        this.progressBarMove.bind(this);


        if (this.prevButton != null)
            this.prevButton.onclick = this.previousSlide.bind(this);
        if (this.nextButton != null)
            this.nextButton.onclick = this.nextSlide.bind(this);

        /* Launching */
        this.play();
    }


    progressBarMove(){
        if(this.progressBarWidth >= 100) {
            this.progressBarWidth = 0;
            this.render();
            return;
        }

        this.progressBarWidth = this.progressBarWidth + 0.1 ;
        this.render();
    }

    clearIntervals(){
        clearInterval(this.timer);
        clearInterval(this.progressBarTimer);
        this.progressBarWidth = 0;
    }
    nextSlide() {
        this.clearIntervals();

        if (this.isLastSlide()) {
            return this.goToFirstSlide();
        }
        this.goToNextSlide();
    }

    previousSlide() {
        this.clearIntervals();
        if (this.isFirstSlide()) {
            return this.goToLastSlide();
        }
        this.goToPreviousSlide();
        this.play();
    }

    isLastSlide() {
        return this.currentSlide === this.totalSlides - 1;
    }

    isFirstSlide() {
        return this.currentSlide === 0;
    }

    goToFirstSlide() {
        this.currentSlide = 0;
        this.currentPosition = 0;
        this.play();

        return this.render();
    }

    goToNextSlide() {
        this.currentSlide++;
        this.play();

        return this.render();
    }

    goToLastSlide() {
        this.currentSlide = this.totalSlides - 1;
        this.play();

        return this.render();
    }


    goToPreviousSlide() {
        this.currentSlide--;
        this.play();

        return this.render();
    }

    play() {
        if(this.timer != null) this.clearIntervals();
        this.timer = setInterval(function (_) {
            this.nextSlide();
        }.bind(this), this.interval);
        if(this.progressBarTimer)
            clearInterval(this.progressBarTimer);
        this.progressBarTimer = setInterval(function () {
            this.progressBarMove();
        }.bind(this), (this.interval/1000) );
    }

    whileDragging(event) {
        if (!this.dragging) {
            return;
        }
        this.moveSlides(event);
        this.render();
    }

    moveSlides(event) {
        this.transformValue = event.clientX - this.initialMousePosition;
        this.currentPosition = this.initialSlidePosition + this.transformValue;
    }

    startDrag(event) {
        console.log('Start Drag')
        this.dragging = true;
        this.initialMousePosition = event.clientX;
        this.initialSlidePosition = this.currentPosition;
        this.clearIntervals();
    }

    endDrag(){

        this.dragging = false;
        let shouldMove = Math.abs(this.currentPosition - this.initialSlidePosition) >= this.effectiveTransform;

        if( shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide()) {
            this.previousSlide();
        }

        if(shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide()) {
            this.nextSlide();

        }
        this.play();

        this.render();
    }

    render() {
        if (!this.dragging)
            this.currentPosition = (-this.currentSlide * window.innerWidth);
        this.sliderContainer.style.left = `${this.currentPosition}px`;
        this.progressbar.style.width = `${this.progressBarWidth}%`
    }

}

new Slider('slider');
new Slider('slider2');
