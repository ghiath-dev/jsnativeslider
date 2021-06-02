class Slider {

    constructor(sliderId = "slider") {
        this.slider = document.getElementById(sliderId);
        this.sliderContainer = this.slider.querySelector(".slider-container");
        this.prevButton = this.slider.querySelector('.button-left');
        this.nextButton = this.slider.querySelector('.button-right');
        this.interval = this.slider.dataset.interval || 3000;
        this.progressbar = this.slider.querySelector('.progressBar');
        this.numberOfSliderPerScreen = this.slider.dataset.numberOfSlidesPerScreen || 1;
        this.loopSlides =  this.slider.dataset.loopSlides || 'true';
        console.log(this.loopSlides)
        this.slideImages = this.sliderContainer.children;
        this.changeImagesWidth();


        /* Attributes */
        this.currentSlide = 0;
        this.currentPosition = 0;
        this.dragging = false;
        this.timer = null;
        this.transformValue = 0;

        /* Options */
        this.effectiveTransform = 400;
        this.totalSlides = this.sliderContainer.childElementCount;
        this.windowSize = (this.totalSlides * window.innerWidth) / this.numberOfSliderPerScreen;
        this.sliderContainer.style.width = `${this.windowSize}px`;

        /* Functionality */
        this.slider.onmousedown = this.startDrag.bind(this);
        this.slider.onmousemove = this.whileDragging.bind(this);
        this.slider.onmouseup = this.endDrag.bind(this);

        this.progressBarMove.bind(this)

        if (this.prevButton != null)
            this.prevButton.onclick = this.previousSlide.bind(this);
        if (this.nextButton != null)
            this.nextButton.onclick = this.nextSlide.bind(this);

        /* Launching */
        this.play();
    }


    changeImagesWidth() {

        for (var i = 0; i < this.slideImages.length; i++) {
            this.slideImages[i].style.width = `${100 / this.slideImages.length}%`

        }
    }
    resetTimers() {
        if (this.timer !== null)
            clearInterval(this.timer);
    }

    play() {
        if (this.timer != null) this.resetTimers();
        this.progressBarMove()


        this.timer = setInterval(function (_) {
            this.nextSlide();
        }.bind(this), this.interval);

    }

    render() {
        if (!this.dragging)
            this.currentPosition = (-this.currentSlide * window.innerWidth);

        this.sliderContainer.style.left = `${this.currentPosition}px`;
    }


    moveSlides(event) {
        this.transformValue = event.clientX - this.initialMousePosition;
        this.currentPosition = this.initialSlidePosition + this.transformValue;
    }

    progressBarMove() {
        // animate
        console.log(123)

        this.progressbar.animate([
                {width: '0%'},
                {width: '100%'}
            ],{
                iterations: 1,
                duration: parseInt(this.interval)
            }
        )
    }
    startDrag(event) {
        this.dragging = true;
        this.initialMousePosition = event.clientX;
        this.initialSlidePosition = this.currentPosition;
        this.resetTimers();
    }

    whileDragging(event) {
        if (!this.dragging) {
            return;
        }
        this.moveSlides(event);
        this.render();
    }

    endDrag() {

        this.dragging = false;
        let shouldMove = Math.abs(this.currentPosition - this.initialSlidePosition) >= this.effectiveTransform;

        if (shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide()) {
            this.previousSlide();
        }

        if (shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide()) {
            this.nextSlide();

        }
        this.play();

        this.render();
    }

    nextSlide() {
        this.resetTimers();

        if (this.isLastSlide()) {
            console.log(this.isLastSlide())
            if(this.loopSlides === 'true')
                return this.goToFirstSlide();
            return
        }
        this.goToNextSlide();
    }

    previousSlide() {
        this.resetTimers();

        if (this.isFirstSlide()) {

            if(this.loopSlides === 'true')
                return this.goToLastSlide();
            return;
        }
        this.goToPreviousSlide();
    }

    isLastSlide() {
        return this.currentSlide === (this.totalSlides - 1) / this.numberOfSliderPerScreen;
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
        this.currentSlide = (this.totalSlides - 1)/this.numberOfSliderPerScreen;
        this.play();

        return this.render();
    }


    goToPreviousSlide() {
        this.currentSlide--;
        this.play();

        return this.render();
    }
}

new Slider('slider');
new Slider('slider2');
