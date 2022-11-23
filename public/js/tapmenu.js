//현재보고있는 페이지 경로값
let curruntPath = window.location.pathname;
let galTapmenu = document.querySelectorAll(".gal_tapmenu li");

galTapmenu.forEach((item,index)=>{
     let galTapmenuChild = item.querySelector("a").getAttribute("href");
     if(curruntPath === galTapmenuChild){
        item.classList.add("on");
     }
});