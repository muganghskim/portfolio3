//현재보고있는 페이지 경로값
let curruntPath = window.location.pathname;
let galTapmenu = document.querySelectorAll(".gal_tapmenu li");
let tap2 = document.querySelectorAll(".tap2 li");

galTapmenu.forEach((item,index)=>{
     let galTapmenuChild = item.querySelector("a").getAttribute("href");
     if(curruntPath.includes(galTapmenuChild)){
        item.classList.add("on");
     }
     else if(curruntPath == "/news" && galTapmenuChild == "/news/all"){
         item.classList.add("on");
     }
     else if(curruntPath == "/prdlist" && galTapmenuChild == "/prdlist/all"){
        item.classList.add("on");
    }
});



