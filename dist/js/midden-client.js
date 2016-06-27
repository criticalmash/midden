/**
 * Client side scripts for midden.js
 * Adds hide/reveal functionality to 
 * midden-* elements
 */
/* globals window, document */
(function(window, undefined) {
  
  function toggleNest(e){
    var nest = this.parentNode.querySelector('.midden-nest');
    if(nest){
      if(nest.style.display === 'block'){
        nest.style.display = 'none';
      }else{
        nest.style.display = 'block';
      }
    }
    
  }

  // find all 
  var elements = document.querySelectorAll('.midden-parent > .midden-element');
  
  // attach a click event to each root that reacts to clicks on midden-element's
  
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", toggleNest, false);
  }
  
  
})(window);