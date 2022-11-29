const gnbWrap = document.querySelector(".gnbWrap");
const depthbg = document.querySelector(".depthbg")
const depths = document.querySelectorAll(".depth");
const depthWrap2 = document.querySelectorAll(".depthWrap2");
const depth2 = document.querySelectorAll(".depth2"); 
const hbgMenu = document.querySelector(".hbgMenu");
const downarrow = document.querySelectorAll(".downarrow");
const rightarrow = document.querySelectorAll(".rightarrow");

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

hbgBtn.addEventListener("click",function(){
    hbgMenu.classList.toggle("on");
    hbgBtn.classList.toggle("on");
    container.classList.toggle("on");
    footer.classList.toggle("on");
});