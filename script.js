class Slider {

    constructor(sliderId = "slider") {
        this.slider = document.getElementById(sliderId);
        this.sliderContainer = this.slider.querySelector(".slider-container");
        this.prevButton = this.slider.querySelector('.button-left');
        this.nextButton = this.slider.querySelector('.button-right');

        /* Attributes */
        this.currentSlide = 0;
        this.currentPosition = 0;
        this.dragging = false;
        this.timer = null;
        this.transformValue = 0;

        /* Options */
        this.effectiveTransform = 400;
        this.totalSlides = this.sliderContainer.childElementCount;
        this.windowSize = this.totalSlides * window.innerWidth;
        this.sliderContainer.style.width = `${this.windowSize}px`;

        /* Functionality */
        this.slider.onmousedown = this.startDrag.bind(this);
        this.slider.onmousemove = this.whileDragging.bind(this);
        this.slider.onmouseup = this.endDrag.bind(this);

        if (this.prevButton != null)
            this.prevButton.onclick = this.previousSlide.bind(this);
        if (this.nextButton != null)
            this.nextButton.onclick = this.nextSlide.bind(this);

        /* Launching */
        this.play();
    }

    nextSlide() {
        clearInterval(this.timer);

        if (this.isLastSlide()) {
            return this.goToFirstSlide();
        }
        this.goToNextSlide();
        this.play();
    }

    previousSlide() {
        clearInterval(this.timer);
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
        return this.render();
    }

    goToNextSlide() {
        this.currentSlide++;
        return this.render();
    }

    goToLastSlide() {
        this.currentSlide = this.totalSlides - 1;
        return this.render();
    }


    goToPreviousSlide() {
        this.currentSlide--;
        return this.render();
    }

    play() {
        if(this.timer != null) clearInterval(this.timer);
        this.timer = setInterval(function (_) {
            this.nextSlide();
        }.bind(this), 3000);
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
        clearInterval(this.timer);
    }

    endDrag() {
        this.dragging = false;
        let shouldMove = Math.abs(this.currentPosition - this.initialSlidePosition) >= this.effectiveTransform;

        if( shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide()) {
            this.previousSlide();
        }

        if(shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide()) {
            this.nextSlide();
        }
        this.render();
    }

    render() {
        if (!this.dragging)
            this.currentPosition = (-this.currentSlide * window.innerWidth);

        this.sliderContainer.style.left = `${this.currentPosition}px`;
    }

}

new Slider('slider');
new Slider('slider2');
