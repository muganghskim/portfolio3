
// ex countDownInit("2022-12-12 00:00:00",".timer",".countView");

function countDownInit (setTime,viewParent,viewChild){
    let countDown = setInterval(function(){
        //시간관련 객체 생성
        let test = new Date();

        //9월 1일의 시간을 밀리세컨드로 보여줌
        let test2 = new Date(setTime);

        //현재시간 밀리세컨드 변수에 담음
        let today = test.getTime();
        //9월1일 시간 밀리세컨드 변수에 담음
        let lastDay = test2.getTime();

        //9월1일 시간에서 현재시간을 빼면 남은 시간이 나온다
        let resultDay = lastDay - today;

        //일,시,분,초를 표현하는 계산식
        const seconds = 1000; //1초
        const minutes = seconds * 60; //60초 (1분)
        const hours = minutes * 60; //60분 (1시간)
        const days = hours * 24; //24시간 (1일)

        //남은 일 계산
        let cdays = Math.floor(resultDay / days);
        //남은 시 계산
        let chours = Math.floor((resultDay % days) / hours);
        //남은 분 계산
        let cminutes =  Math.floor((resultDay % hours) / minutes);
        //남은 초 계산
        let cseconds = Math.floor((resultDay % minutes) / seconds);
        //일 ,시 ,분 초가 두자리 수인지 한자리 수 인지 확인해서 한자리면 앞에 0을 붙여준다
        let timeSet = [cdays,chours,cminutes,cseconds]; //배열에 담아줌
        const timerTag = document.querySelectorAll(viewParent); //글자 표현될 부모태그 선택
        //반복문으로 조건문 여러번 실행
        for(let i = 0; i < timeSet.length; i++){
            if(timeSet[i] < 10){ //숫자가 한자리 일때
                timerTag[i].querySelector(viewChild).innerHTML = "0"+timeSet[i];
            }
            else{
                timerTag[i].querySelector(viewChild).innerHTML = timeSet[i];
            }
        }
        //남은시간이 0보다 작다면 (시간이 만료됬다면)
        if(resultDay < 0){
            clearInterval(countDown); //자동실행 함수 담고있는 변수 이름으로 멈춰줌
            //일 시분초가 00 00 00 00 으로 강제 변환
            for(let i=0; i < timeSet.length; i++){
                timerTag[i].querySelector(viewChild).innerHTML = "00";
            }
            //태그 삭제 (코드상에서 제거됨)
            document.querySelector(".buy").remove();
        }
    },1000);
}