let btnSidebar = document.getElementById('btn-hamburger');
let btnClose = document.getElementById('btn-close');
let nav = document.getElementById('nav');

function addClass(myClass){
    nav.classList.add(myClass)
}
function removeClass(myClass){
    nav.classList.remove(myClass)
}

function openSidebar(){
    addClass('open');
    removeClass('close');
}
function closeSidebar(){
    addClass('close');
    removeClass('open');
}

btnSidebar.addEventListener('click', ()=>{
    openSidebar()
})
btnClose.addEventListener('click', ()=>{
    closeSidebar()
})
