(function(){
const btn = document.getElementById('backToTop');
const showAfter = 200; // px scrolled before showing button


// Show/hide button on scroll
function onScroll(){
if(window.pageYOffset > showAfter){
btn.classList.add('show');
} else {
btn.classList.remove('show');
}
}


// Smooth scroll to top with accessibility fallback
function scrollToTop(){
// If browser supports smooth behavior (most modern do), use it. Otherwise, fallback to instant.
try{
window.scrollTo({ top:0, behavior: (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') });
} catch (e){
window.scrollTo(0,0);
}
}


// Keyboard: allow Enter or Space to activate when focused
btn.addEventListener('click', scrollToTop);
btn.addEventListener('keydown', function(e){
if(e.key === 'Enter' || e.key === ' '){
e.preventDefault();
scrollToTop();
}
});


// Efficiently listen to scroll with passive handler
window.addEventListener('scroll', onScroll, {passive:true});


// Initialize
onScroll();


// Optional: hide when printing
window.matchMedia('print').addListener(() => btn.style.display = 'none');
})();