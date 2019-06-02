/* code from: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android */


function swipe_init (cb) {
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
    callback = cb
}


var xDown = null;                                                        
var yDown = null;
var callback = null


function getTouches(evt) {
  return evt.touches
}                                                     


function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
}


function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xUp - xDown;
    var yDiff = yUp - yDown;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 100 ) {
            callback('R')
        } else {
            callback('L')
        }                       
    } else {
        if ( yDiff > 100 ) {
            callback('D')
        } else { 
            callback('U')
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
} 


export { swipe_init }
