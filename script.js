class Slider {

    constructor(sliderId = "slider") {
        /* Data */
        this.slider = document.getElementById(sliderId);
        this.sliderContainer = this.slider.querySelector(".slider-container");
        this.prevButton = this.slider.querySelector('.button-left');
        this.nextButton = this.slider.querySelector('.button-right');
        this.interval =  parseInt(this.slider.dataset.interval) || 3000;
        this.progressbar = this.slider.querySelector('.progress-bar');
        this.sliderPerScreen = parseInt( this.slider.dataset.slidesPerScreen) || 1;
        this.shouldLoop =  (this.slider.dataset.shouldLoop || 'true') === 'true';
        this.isRtl =  (this.slider.dataset.isrtl || 'false') === 'true';
        this.hasThumbnails =   (this.slider.dataset.hasThumbnails || 'true') === 'true';
        this.slideItems = this.sliderContainer.children;
        this.showFullScreen = (this.slider.dataset.showFullScreen || 'false') === 'true';
        this.hasIndicetors = (this.slider.dataset.hasIndicetors || 'false') === 'true';
        /* Attributes */
        this.currentSlide = 0;
        this.currentPosition = 0;
        this.dragging = false;
        this.timer = null;
        this.transformValue = 0;

        /* Options */
        this.effectiveTransform = 200;
        this.totalSlides = this.sliderContainer.childElementCount;
        this.windowSize = (this.totalSlides * window.innerWidth) / this.sliderPerScreen;
        this.sliderContainer.style.width = `${this.windowSize}px`;


        /* Binds */
        this.createThumbnails.bind(this);
        this.progressBarMove.bind(this)

        /* Functionality */
        this.setImagesWidth();

        /** TODO: Enable & Disable Dragging */
        this.slider.onmouseup = this.endDrag.bind(this);
        this.slider.onmousedown = this.startDrag.bind(this);
        this.slider.onmousemove = this.whileDragging.bind(this);

        if(this.prevButton !== null) this.prevButton.onclick = this.isRtl ? this.nextSlide.bind(this) : this.previousSlide.bind(this);
        if(this.nextButton !== null) this.nextButton.onclick = this.isRtl ? this.previousSlide.bind(this) : this.nextSlide.bind(this);
        if(this.hasThumbnails) this.createThumbnails();
        if(this.hasIndicetors) this.createIndicators();

        /* Launching */
        this.play();
    }


    createIndicators(){
        let numberOfIndicators = this.sliderContainer.childElementCount;
        let indicatorsDiv = document.createElement('div');

        indicatorsDiv.classList.add('indicators');

        for(let i = 0; i < numberOfIndicators; i++){
            let indicator = document.createElement('div');
            indicator.classList.add('indicator');
            indicator.onclick = () => this.goToElement(i);
            indicatorsDiv.appendChild(indicator);
        }

        this.slider.appendChild(indicatorsDiv);

    }

    setImagesWidth() {

        this.sliderContainer.style.height = this.showFullScreen ? `100vh` : 'auto';

        for (let i = 0; i < this.slideItems.length; i++) {
            this.slideItems[i].style.width = `${100 / this.slideItems.length}%`;

            this.isRtl ? this.slideItems[i].style.marginLeft = (i+1) % this.sliderPerScreen !==0 ? `1%`: '0':
                this.slideItems[i].style.marginRight = (i+1) % this.sliderPerScreen !==0? `1%`: '0';
        }
    }


    resetTimers() {
        if (this.timer !== null)
            clearInterval(this.timer);
    }

    play() {
        if (this.timer != null) this.resetTimers();
        if(this.progressbar !== null) this.progressBarMove();

        this.timer = setInterval(function (_) {
            this.nextSlide();
        }.bind(this), this.interval);
    }

    fillIndicators(){
        let indicators =  this.slider.querySelectorAll('.indicators .indicator');

        indicators.forEach((item)=>{
            item.style.opacity = '.5';
        })
        console.log(this.currentSlide);
        this.slider.querySelector(`.indicators div:nth-child(${this.currentSlide+1 })`).style.opacity='1';

    }
    render() {
        if (!this.dragging)
            this.currentPosition = (this.isRtl ? 1 : -1) * (this.currentSlide * window.innerWidth);

        if(this.hasIndicetors) this.fillIndicators();
        this.sliderContainer.style.left = `${this.currentPosition}px`;
    }


    moveSlides(event) {
        this.transformValue = event.clientX - this.initialMousePosition;
        this.currentPosition = this.initialSlidePosition + this.transformValue;
    }

    progressBarMove() {
        this.progressbar.animate([
                {width: '0%'},
                {width: '100%'}
            ],{
            easing: 'ease-out',
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
        console.log(`${shouldMove} && ${this.initialSlidePosition < this.currentPosition} && ${!this.isFirstSlide()}`)
        console.log(shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide())
        if (shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide()) {
            this.isRtl? this.nextSlide(): this.previousSlide();
        }

        console.log(shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide())
        console.log(`${shouldMove} && ${this.initialSlidePosition > this.currentPosition} && ${!this.isLastSlide()}`)
        if (shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide()) {
            this.isRtl? this.previousSlide(): this.nextSlide();

        }
        this.play();

        this.render();
    }

    nextSlide() {
        this.resetTimers();

        if (this.isLastSlide()) {
            return this.goToFirstSlide();

        }
        this.goToNextSlide();

    }

    previousSlide() {
        this.resetTimers();


        if (this.isFirstSlide()) {

            return this.goToLastSlide();
        }
        this.goToPreviousSlide();

    }

    isLastSlide() {
        return this.currentSlide === Math.floor((this.totalSlides - 1) / this.sliderPerScreen);
    }

    isFirstSlide() {
        return this.currentSlide === 0;
    }

    goToFirstSlide() {
        if(this.shouldLoop) {
            this.currentSlide = 0;
            this.play();
        }
        return this.render();

    }

    goToNextSlide() {
        this.currentSlide++;

        this.play();

        return this.render();
    }

    goToLastSlide() {
        if(this.shouldLoop) {

            this.currentSlide = (this.totalSlides - 1) / this.sliderPerScreen;
            this.play();

            return this.render();
        }
    }


    goToPreviousSlide(){
        if(!this.isFirstSlide())
            this.currentSlide--;
        this.play();

        return this.render();
    }

    IsSlidesAllOnScreen(){
        return this.sliderPerScreen === this.totalSlides;
    }
    createThumbnails(){

        let thumbnailsDiv = document.createElement('div');
        thumbnailsDiv.classList.add('thumbnails');
        let thumbnailsImages = this.sliderContainer.querySelectorAll('.slide img');

        thumbnailsImages.forEach(function (item, index) {
            thumbnailsDiv.appendChild(this.createThumbnail(item.getAttribute('src'), index));
        }.bind(this));

        this.slider.appendChild(thumbnailsDiv);
    }
    goToElement(index){
        // return console.log(index)
        this.currentSlide = Math.floor(index/this.sliderPerScreen);
        this.render();
    }
    createThumbnail(src,index) {
        let thumb = document.createElement('div');
        thumb.style.backgroundImage = `url(${src})`;
        thumb.onclick = ()=>this.goToElement(index);
        return thumb;
    }
}

let slider = new Slider('slider');
new Slider('slider2');

// class Slider {
//
//     constructor(sliderId = "slider") {
//         /* Data */
//         this.isrtl =  document.getElementsByTagName('html')[0].getAttribute('dir') === 'rtl';
//         this.slider = document.getElementById(sliderId);
//         this.sliderContainer = this.slider.querySelector(".slider-container");
//         this.prevButton = this.slider.querySelector('.button-left');
//         this.nextButton = this.slider.querySelector('.button-right');
//         this.interval =  parseInt(this.slider.dataset.interval) || 3000;
//         this.progressbar = this.slider.querySelector('.progress-bar');
//         this.sliderPerScreen = parseInt( this.slider.dataset.slidesPerScreen) || 1;
//         this.shouldLoop =  (this.slider.dataset.shouldLoop || 'true') === 'true';
//         this.hasThumbnails =   (this.slider.dataset.hasThumbnails || 'true') === 'true';
//         this.slideItems = this.sliderContainer.children;
//
//         /* Attributes */
//         this.currentSlide = 0;
//         this.currentPosition = 0;
//         this.dragging = false;
//         this.timer = null;
//         this.transformValue = 0;
//
//         /* Options */
//         this.effectiveTransform = 400;
//         this.totalSlides = this.sliderContainer.childElementCount;
//         this.windowSize = (this.totalSlides * window.innerWidth) / this.sliderPerScreen;
//         this.sliderContainer.style.width = `${this.windowSize}px`;
//
//         /* Binds */
//         this.createThumbnails.bind(this);
//         this.progressBarMove.bind(this)
//
//         /* Functionality */
//         this.setImagesWidth();
//
//         /** TODO: Enable & Disable Dragging */
//         this.slider.onmouseup = this.endDrag.bind(this);
//         this.slider.onmousedown = this.startDrag.bind(this);
//         this.slider.onmousemove = this.whileDragging.bind(this);
//
//         if(this.isrtl){
//             if(this.prevButton !== null) this.prevButton.onclick = this.previousSlide.bind(this);
//             if(this.nextButton !== null) this.nextButton.onclick = this.nextSlide.bind(this);
//         }
//
//         if(this.prevButton !== null) this.prevButton.onclick = this.previousSlide.bind(this);
//         if(this.nextButton !== null) this.nextButton.onclick = this.nextSlide.bind(this);
//
//         if(this.hasThumbnails ) this.createThumbnails();
//
//         /* Launching */
//         this.play();
//     }
//
//     setImagesWidth() {
//         for (let i = 0; i < this.slideItems.length; i++) {
//             this.slideItems[i].style.width = `${100 / this.slideItems.length}%`;
//             this.slideItems[i].style.marginRight = (i+1) % this.sliderPerScreen !==0? `1%`: '0';
//         }
//     }
//
//     resetTimers() {
//         if (this.timer !== null)
//             clearInterval(this.timer);
//     }
//
//     play() {
//         if (this.timer != null) this.resetTimers();
//         if(this.progressbar !== null) this.progressBarMove();
//
//         this.timer = setInterval(function (_) {
//             this.nextSlide();
//         }.bind(this), this.interval);
//     }
//
//     render() {
//
//         if (!this.dragging)
//             this.currentPosition = (-this.currentSlide * window.innerWidth);
//
//         if(this.isrtl){
//             return  this.sliderContainer.style.right = `${this.currentPosition}px`;
//
//         }
//         this.sliderContainer.style.left = `${this.currentPosition}px`;
//
//
//     }
//
//
//     moveSlides(event) {
//         // if(this.isrtl){
//         //
//         //     this.transformValue = event.clientX - this.initialMousePosition;
//         //     return this.currentPosition = this.initialSlidePosition + this.transformValue;
//         // }
//
//         this.transformValue = event.clientX - this.initialMousePosition;
//         this.currentPosition = this.initialSlidePosition + this.transformValue;
//     }
//
//     progressBarMove() {
//         this.progressbar.animate([
//                 {width: '0%'},
//                 {width: '100%'}
//             ],{
//                 easing: 'ease-out',
//                 iterations: 1,
//                 duration: parseInt(this.interval)
//             }
//         )
//     }
//     startDrag(event) {
//         this.dragging = true;
//         this.initialMousePosition = event.clientX;
//         this.initialSlidePosition = this.currentPosition;
//         this.resetTimers();
//     }
//
//     whileDragging(event) {
//         if (!this.dragging) {
//             return;
//         }
//         this.moveSlides(event);
//         this.render();
//     }
//
//     endDrag() {
//
//         this.dragging = false;
//         let shouldMove = Math.abs(this.currentPosition - this.initialSlidePosition) >= this.effectiveTransform;
//
//         if (shouldMove && this.initialSlidePosition < this.currentPosition && !this.isFirstSlide()) {
//             this.previousSlide();
//         }
//
//         if (shouldMove && this.initialSlidePosition > this.currentPosition && !this.isLastSlide()) {
//             this.nextSlide();
//
//         }
//         this.play();
//
//         this.render();
//     }
//
//     nextSlide() {
//         this.resetTimers();
//
//         if (this.isLastSlide()) {
//             return this.goToFirstSlide();
//
//         }
//         this.goToNextSlide();
//
//     }
//
//     previousSlide() {
//         this.resetTimers();
//
//
//         if (this.isFirstSlide()) {
//
//             return this.goToLastSlide();
//         }
//         this.goToPreviousSlide();
//
//     }
//
//     isLastSlide() {
//         return this.currentSlide === Math.floor((this.totalSlides - 1) / this.sliderPerScreen);
//     }
//
//     isFirstSlide() {
//         return this.isrtl? (this.currentSlide === (this.totalSlides-1) / this.sliderPerScreen) :  this.currentSlide === 0;
//     }
//
//     goToFirstSlide() {
//         if(this.shouldLoop) {
//             this.isrtl ? (this.currentSlide = (this.totalSlides - 1) / this.sliderPerScreen):
//
//                 this.currentSlide = 0;
//             this.play();
//         }
//         return this.render();
//
//     }
//
//     goToNextSlide() {
//
//         if(this.isrtl){
//             this.currentSlide++;
//             this.play();
//             return this.render();
//         }
//         this.currentSlide++;
//         this.play();
//
//         return this.render();
//     }
//
//     goToLastSlide() {
//         if(this.shouldLoop) {
//
//             this.isrtl? this.currentSlide = 0 : this.currentSlide = (this.totalSlides - 1) / this.sliderPerScreen;
//             this.play();
//
//             return this.render();
//         }
//     }
//
//
//     goToPreviousSlide(){
//         if(this.isrtl){
//             this.currentSlide++;
//             this.play();
//             return this.render();
//         }
//         this.currentSlide--;
//         this.play();
//
//         return this.render();
//     }
//
//
//     createThumbnails(){
//
//         let thumbnailsDiv = document.createElement('div');
//         thumbnailsDiv.classList.add('thumbnails');
//         let thumbnailsImages = this.sliderContainer.querySelectorAll('.slide img');
//
//         thumbnailsImages.forEach(function (item, index) {
//             thumbnailsDiv.appendChild(this.createThumbnail(item.getAttribute('src'), index));
//         }.bind(this));
//
//         this.slider.appendChild(thumbnailsDiv);
//     }
//     goToElement(index){
//         // return console.log(index)
//         this.currentSlide = Math.floor(index/this.sliderPerScreen);
//         this.render();
//     }
//     createThumbnail(src,index) {
//         let thumb = document.createElement('div');
//         thumb.style.backgroundImage = `url(${src})`;
//         thumb.onclick = ()=>this.goToElement(index);
//         return thumb;
//     }
// }
//
// let slider = new Slider('slider');
// new Slider('slider2');
