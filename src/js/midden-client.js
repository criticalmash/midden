/**
 * Client side scripts for midden.js
 * Adds hide/reveal functionality to 
 * midden-* elements
 */
/* globals window, document */
(function(window, undefined) {
  
  function toggleNest(e){
    var nest = this.parentNode.querySelector('.midden-nest');
    nest.classList.toggle('midden-show');
  }

  // find all 
  var elements = document.querySelectorAll('.midden-parent > .midden-element');
  
  // attach a click event to each root that reacts to clicks on midden-element's
  
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", toggleNest, false);
  }
  
  
})(window);