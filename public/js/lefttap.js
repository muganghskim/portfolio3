const gnbWrap = document.querySelector(".gnbWrap");
const depthbg = document.querySelector(".depthbg")
const depths = document.querySelectorAll(".depth");
const depthWrap2 = document.querySelectorAll(".depthWrap2");
const depth2 = document.querySelectorAll(".depth2"); 
const hbgMenu = document.querySelector(".hbgMenu");
const downarrow = document.querySelectorAll(".downarrow");
const rightarrow = document.querySelectorAll(".rightarrow");

//resize 이벤트
window.addEventListener("resize",function(){
    hbgresize();
});

window.addEventListener("load",function(){
    hbgresize();
});

function hbgresize (){
    if(window.innerWidth <= 1000 && window.innerWidth > 0){
        hbgMenu.classList.add("on");
        hbgBtn.classList.add("on");
        container.classList.add("on");
        footer.classList.add("on");
    }
    else{
        hbgMenu.classList.remove("on");
        hbgBtn.classList.remove("on");
        container.classList.remove("on");
        footer.classList.remove("on");
    }
}

//hbg드롭 다운 메뉴 등장
depthWrap2.forEach(function(item,index){
    item.addEventListener("click",function(){
        if(depth2[index].classList.contains("on")){
            depth2[index].classList.remove("on");
            item.classList.remove("on");
            downarrow[index].classList.remove("on");
            rightarrow[index].classList.remove("on");
        }
        else{
            depth2.forEach(function(item,index){
                item.classList.remove("on");
                depthWrap2[index].classList.remove("on");
                downarrow[index].classList.remove("on");
                rightarrow[index].classList.remove("on");
            });
            depth2[index].classList.add("on");
            item.classList.add("on");
            downarrow[index].classList.add("on");
            rightarrow[index].classList.add("on");
        }
    });
});

//햄버거 메뉴
const hbgBtn = document.querySelector(".hbgBtn");
const container = document.querySelector("#container");
const footer = document.querySelector("#footer");
const bg = document.querySelector(".hbgMenu .bg");

hbgBtn.addEventListener("click",function(){
    if(window.innerWidth <= 1000 && window.innerWidth > 0){
        hbgMenu.classList.remove("on");
        hbgMenu.style.backgroundColor = "#fff";
        hbgMenu.style.width = "290px";
        bg.style.display = "block";
        bg.addEventListener("click",function(){
            hbgMenu.classList.add("on");
            bg.style.display = "none";
        });
    }
    else{
        hbgMenu.classList.toggle("on");
        hbgBtn.classList.toggle("on");
        container.classList.toggle("on");
        footer.classList.toggle("on");  
    }
});