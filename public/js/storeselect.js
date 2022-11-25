//옵션태그 생성 및 이벤트 거는 구간
// 시,도 나오게 처리하는 구간
const city1 = document.querySelector(".city1");
const city2 = document.querySelector(".city2");

for(let i = 0; i < hangjungdong.sido.length; i++){
    let city1Tag = document.createElement("option"); //태그 생성
    let city1Text = document.createTextNode(hangjungdong.sido[i].codeNm); //태그에 들어갈 텍스트 생성
    city1Tag.append(city1Text);
    city1Tag.setAttribute("value",hangjungdong.sido[i].codeNm);
    city1Tag.setAttribute("data-sido",hangjungdong.sido[i].sido);
    city1.append(city1Tag);
}
// city1 셀렉트 태그에 change 이벤트를 사용하여 해당 시/도를 고르면  해당하는 구/군 option 태그 생성
city1.addEventListener("change",function(){
    //선택한 option 태그의 data-sido의 값을 가지고 옴
    let city1Data = city1.options[city1.selectedIndex].getAttribute("data-sido");
    
    // 구 / 군 만드는 코드 함수로 만들어서 호출
    sigugun(city1Data);
});

//시/구/군 생성하는 코드작업 함수

function sigugun(city1Data){
    //기존 option 태그들 갈아치워주자
    city2.innerHTML = "<option value>구/군 선택</option>";

    //반복문을 이용하여 데이터 sido 코드값에 맞는 구/군의 데이터를 기반으로 option 태그 생성
    for(let i=0; i < hangjungdong.sigugun.length; i++){
        // 전달받은 시도 코드값과 행정동 객체에 있는 시도 코드값하고 일치하면 option 태그 생성
        if(city1Data == hangjungdong.sigugun[i].sido){
            let city2Tag = document.createElement("option"); //태그 생성
            let city2Text = document.createTextNode(hangjungdong.sigugun[i].codeNm); //태그에 들어갈 텍스트 생성
            city2Tag.append(city2Text);
            city2Tag.setAttribute("value",hangjungdong.sigugun[i].codeNm);
            city2.append(city2Tag);
        }
    }
}