const userid = document.querySelector("#userid");
const userpass = document.querySelector("#userpass");
const submitBtn = document.querySelector("#submitBtn");
const messages = document.querySelectorAll(".message");
const username = document.querySelector("#username");
const result = document.querySelector("#join_form");

let idCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,12}$/; //체크할 문자패턴 수식
let passCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/; //영문 숫자 특수기호 조합 8자리 이상 25자리 이하
let nameCheck = /^[ㄱ-힣]{2,4}$/

submitBtn.addEventListener("click",function(e){
    
    let idValue = userid.value;
    let passValue = userpass.value;
    let nameValue = username.value;

    let checkComplete3 = idCheck.test(idValue);
    let checkComplete4 = passCheck.test(passValue);
    let checkComplete1 = nameCheck.test(nameValue);
    
    if(checkComplete1){
        messages[0].innerHTML = "이름을 형식에 맞게 입력하였습니다.";
        messages[0].style.color = "green";
    }
    else{
        messages[0].innerHTML = "이름은 2~4자리의 한글만 가능합니다.";
        messages[0].style.color = "red";
    }
    if(checkComplete3){
        messages[1].innerHTML = "아이디를 형식에 맞게 입력하였습니다.";
        messages[1].style.color = "green";
    }
    else{
        messages[1].innerHTML = "아이디는 영문 숫자 조합 6자리 이상 12자리 이하만 가능합니다.";
        messages[1].style.color = "red";
    }
    if(checkComplete4){
        messages[2].innerHTML = "비밀번호를 형식에 맞게 입력하였습니다.";
        messages[2].style.color = "green";
    }
    else{
        messages[2].innerHTML = "비밀번호는 영문 숫자 특수기호 조합 8자리 이상 25자리 이하만 가능합니다.";
        messages[2].style.color = "red";
    }
    if(checkComplete1 && checkComplete3 && checkComplete4){
        result.submit();
    }
    else{
        alert("제대로 다시 입력해 주세요");
        e.preventDefault();
    }
});