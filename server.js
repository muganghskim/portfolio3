const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const moment = require("moment");
const momentTimezone = require("moment-timezone");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


MongoClient.connect("mongodb+srv://admin:qwer1234@port3.da0cedv.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("port3");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

//파일 다운 스토리지 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
    }
  })
  
const upload = multer({ storage: storage })

//대시보드페이지 get요청
app.get("/dash",function(req,res){
  //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
  db.collection("adlist").find({}).toArray(function(err,result1){
    db.collection("brdlist").find({}).toArray(function(err,result2){
      if(!req.user){
        res.render("dash",{adData:result1,newsData:result2,userData:req.user});
      }
      else{
        db.collection("prdlist").find({prdauther:req.user.joinnick}).sort({prdid:-1}).toArray(function(err,result3){
          let maxcount = [];
          result3.forEach(function(item,index){
            maxcount.push(item.prdviews);
          });
          let maxcountresult = Math.max(...maxcount);
          db.collection("prdlist").findOne({prdviews:maxcountresult},function(err,result4){
            res.render("dash",{adData:result1,newsData:result2,prdData:result3,userData:req.user,maxCount:result4});
          });
        });
      }
    });
  });
});

//메인 검색시
app.get("/prdlist/search/prdname",function(req,res){
  let pageNumber = "nopage";
  // query : <-- store.ejs 파일에서 input name 값
  // path: <-- db storelist 콜렉션에서 name 
  let prdSearch = [
    {
      $search: {
        index: 'product_search',
        text: {
          query: req.query.name,
          path: "prdsubject"
        }
      }
    }
  ]
  //검색어 입력시
  if(req.query.name !== ""){
    db.collection("prdlist").aggregate(prdSearch).toArray(function(err,result){
      res.render("index",{prdData:result,pageNumber:pageNumber,userData:req.user});
    });
  }
  //검색어 미입력시
  else{
    res.redirect("/");
  }
});

//관리자 로그인 페이지
app.get("/admin",function(req,res){
    res.render("admin_login");
});

//관리자 화면 로그인 유무 확인
app.post("/login",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    res.redirect("/admin/brdlist");
    //로그인 성공 시 상품 등록 페이지로 이동
});

//관리자 뉴스등록 페이지
app.get("/admin/brdlist",function(req,res){
    //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
    db.collection("brdlist").find({}).toArray(function(err,result){
      res.render("admin_brdlist",{brdData:result,userData:req.user});
    });
});

//관리자 이벤트등록 페이지
app.get("/admin/adlist",function(req,res){
    //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
    db.collection("adlist").find({}).toArray(function(err,result){
      res.render("admin_adlist",{adData:result,userData:req.user});
    });
});

//관리자 매장등록 페이지
app.get("/admin/storelist",function(req,res){
    //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
    db.collection("storelist").find({}).toArray(function(err,result){
      res.render("admin_store",{storeData:result,userData:req.user});
    });
});
  
  //뉴스를 db에 넣는 경로
  app.post("/add/brdlist",function(req,res){
    db.collection("count").findOne({name:"뉴스등록"},function(err,result1){
      db.collection("brdlist").insertOne({
        num:result1.brdCount + 1,
        name:req.body.name,
        conext:req.body.context,
        newsoption:req.body.newsoption,
        time:moment().tz("Asia/Seoul").format("YYYY-MM-DD")
      },function(err,result){
        db.collection("count").updateOne({name:"뉴스등록"},{$inc:{brdCount:1}},function(err,result){
          res.redirect("/admin/brdlist");
        });
      });
    });
  });

  //이벤트를 db에 넣는 경로
  app.post("/add/adlist",upload.single('thumbnail'),function(req,res){
    //파일 첨부가 있을 때 
    if(req.file){
      fileTest = req.file.originalname;
    }
    //파일 첨부가 없을 때
    else{
      fileTest = null;
    }
    db.collection("count").findOne({name:"이벤트등록"},function(err,result1){
      db.collection("adlist").insertOne({
        num:result1.adCount + 1,
        name:req.body.name,
        conext:req.body.context,
        thumbnail:fileTest,
        time:moment().tz("Asia/Seoul").format("YYYY-MM-DD")
      },function(err,result){
        db.collection("count").updateOne({name:"이벤트등록"},{$inc:{adCount:1}},function(err,result){
          res.redirect("/admin/adlist");
        });
      });
    });
  });

  //관리자 매장 등록 페이지 
app.get("/admin/storelist",function(req,res){
    //모든 매장리스트 데이터
    db.collection("storelist").find({}).toArray(function(err,result){
      res.render("admin_store",{storeData:result,userData:req.user});
    });
  });
  
  //매장등록
  app.post("/addstore",function(req,res){
    db.collection("count").findOne({name:"매장등록"},function(err,result1){
      db.collection("storelist").insertOne({
        num:result1.storeCount + 1,
        name:req.body.name,
        sido:req.body.city1,
        sigugun:req.body.city2,
        adress:req.body.detail,
        phone:req.body.phone
      },function(err,result){
        db.collection("count").updateOne({name:"매장등록"},{$inc:{storeCount:1}},function(err,result){
          res.redirect("/admin/storelist");
        });
      });
    });
  });

//매장 검색 페이지(사용자)
app.get("/store",async function(req,res){
  //사용자가 게시판에 접속 시 몇번 페이징 번호로 접속했는지 체크
  let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
  // 한 페이지당 보여줄 데이터 갯수
  let perPage = 6;
  // 한 블록당 보여줄 페이징 번호 갯수
  let blockCount = 3;
  // 현재 페이지 블록 구하기 
  let blockNum = Math.ceil(pageNumber / blockCount);
  //블록안에 있는 페이징의 시작번호값 알아내기
  let blockStart = ((blockNum - 1) * blockCount) + 1;
  //블록안에 있는 페이징의 끝번호값 알아내기
  let blockEnd = blockStart + blockCount - 1;
  //데이터 베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어
  let totalData = await db.collection("storelist").countDocuments({});
  //전체 데이터 값을 통해서 몇개의 페이징 번호가 만들어져야 하는지
  let paging = Math.ceil(totalData / perPage);
  //만약 블록안에있는 페이징의 끝 번호값이 전체 페이징 갯수보다 많다면 강제로 마지막 페이징 번호값으로 변경
  if(blockEnd > paging){
      blockEnd = paging;
  }
  //블록의 총 갯수
  let totalBlock = Math.ceil(paging / blockCount);
  //데이터베이스에 실제 값을 꺼내기 위해 몇개씩 꺼내올건지 설정 sort / skip / limit
  let startFrom = (pageNumber - 1) * perPage
  db.collection("storelist").find({}).skip(startFrom).limit(perPage).toArray(function(err,result){
    res.render("store",{storeData:result,
                        paging:paging,
                        pageNumber:pageNumber,
                        blockStart:blockStart,
                        blockEnd:blockEnd,
                        blockNum:blockNum,
                        totalBlock:totalBlock,
                        userData:req.user
    });
  });
});

//주소로 검색시(사용자)
app.get("/store/search/local",function(req,res){
  // 시 / 도 선택시
  let pageNumber = "nopage";
  if(req.query.city1 !== "" && req.query.city2 === ""){
    db.collection("storelist").find({sido:req.query.city1}).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber,userData:req.user});
    });
  }
  // 시/도 구/군 선택시
  else if(req.query.city1 !== "" && req.query.city2 !== ""){
    db.collection("storelist").find({sido:req.query.city1,sigugun:req.query.city2}).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber,userData:req.user});
    });
  }
  // 아무것도 선택하지 않았을 때
  else{
    res.redirect("/store");
  }
});

//매장명으로 검색시 (사용자)
app.get("/store/search/storename",function(req,res){
  let pageNumber = "nopage";
  // query : <-- store.ejs 파일에서 input name 값
  // path: <-- db storelist 콜렉션에서 name 
  let storeSearch = [
    {
      $search: {
        index: 'store_search',
        text: {
          query: req.query.name,
          path: "name"
        }
      }
    }
  ]
  //검색어 입력시
  if(req.query.name !== ""){
    db.collection("storelist").aggregate(storeSearch).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber,userData:req.user});
    });
  }
  //검색어 미입력시
  else{
    res.redirect("/store");
  }
});


  //공지사항 (사용자) 화면 경로
app.get("/news",function(req,res){
    db.collection("brdlist").find({}).toArray(function(err,result){
      res.render("news",{brdData:result,userData:req.user});
    });
});

//공지사항 (사용자) 화면 경로
app.get("/news/all",function(req,res){
  db.collection("brdlist").find({}).toArray(function(err,result){
    res.render("news",{brdData:result,userData:req.user});
  });
});

//공지사항 서비스 페이지
app.get("/news/service",function(req,res){
  db.collection("brdlist").find({newsoption:"서비스"}).toArray(function(err,result){
    res.render("news",{brdData:result,userData:req.user});
  });
});

//공지사항 작업 페이지
app.get("/news/work",function(req,res){
  db.collection("brdlist").find({newsoption:"작업"}).toArray(function(err,result){
    res.render("news",{brdData:result,userData:req.user});
  });
});

//공지사항 업데이트카테고리 페이지
app.get("/news/upt",function(req,res){
  db.collection("brdlist").find({newsoption:"업데이트"}).toArray(function(err,result){
    res.render("news",{brdData:result,userData:req.user});
  });
});

app.get("/event",function(req,res){
    db.collection("adlist").find({}).toArray(function(err,result){
      res.render("event",{brdData:result,userData:req.user});
    });
});

//회원가입 페이지 get 요청
app.get("/join",function(req,res){
    res.render("join",{userData:req.user}); //회원가입 페이지로 응답
});

//회원가입 페이지에서 보내준 데이터를 db에 저장요청
app.post("/addjoin",function(req,res){
    db.collection("user").findOne({joinid:req.body.userid},function(err,result){
        //db베이스에서 해당 회원아이디가 존재하는경우
        if(result){
            res.send("<script>alert('이미 가입된 아이디입니다'); location.href='/join'; </script>")
        }
        else{
                db.collection("count").findOne({name:"회원정보"},function(err,result){
                db.collection("user").insertOne({
                    joinno:result.joinCount + 1,
                    joinid:req.body.userid,
                    joinpass:req.body.userpass,
                    joinnick:req.body.username,
                    sido:req.body.city1,
                    sigugun:req.body.city2,
                },function(err,result){
                    db.collection("count").updateOne({name:"회원정보"},{$inc:{joinCount:1}},function(err,result){
                        res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='/login'; </script>")
                    });
                });
            });
        }
    });
});

//로그인 경로 get 요청
app.get("/login",function(req,res){
    res.render("login",{userData:req.user});
});

//로그아웃 경로 get 요청
app.get("/logout",function(req,res){
    req.session.destroy(function(err){ // 요청 -> 세션제거
        res.clearCookie("connect.sid"); // 응답 -> 본인접속 웹브라우저 쿠키 제거
        res.redirect("/");// 메인페이지 이동 
    });
});

//로그인 페이지에서 입력한 아이디 비밀번호 검증 처리 요청
app.post("/addlogin",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    //실패시 /fail 경로로 요청
    res.redirect("/"); //로그인 성공시 메인페이지로 이동
});

// 로그인 실패시 경고창 및 재시도
app.get("/fail",function(req,res){
    res.send("<script>alert('로그인 실패하였습니다. 다시 로그인 해주세요.'); location.href='/login'; </script>");
});


//  /loginresult 경로 요청시 passport.autenticate() 함수구간이 아이디 비번 로그인 검증구간
passport.use(new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpass',
    session: true,
    passReqToCallback: false,
  }, function (userid, userpass, done) {
    // console.log(userid, userpass);
    db.collection('user').findOne({ joinid: userid }, function (err, result) {
      if (err) return done(err)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
      if (userpass == result.joinpass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번이 틀렸습니다' })
      }
    })
  }));


//처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
//  req.user
passport.serializeUser(function (user, done) {
    done(null, user.joinid) //서버에다가 세션만들어줘 -> 사용자 웹브라우저에서는 쿠키를 만들어줘
});
  
  // 로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 있는 회원정보 데이터를 보내주는 처리
  // 그전에 데이터베이스 있는 아이디와 세션에 있는 회원정보중에 아이디랑 매칭되는지 찾아주는 작업
passport.deserializeUser(function (id, done) {
    db.collection('user').findOne({joinid:id }, function (err,result) {
    done(null, result);
    })
});

//각각의 범주마다 페이징 처리위한 객체 생성
let prdobject = [{prdoption:"생활가전"},
                 {prdoption:"의류"},
                 {prdoption:"스포츠"},
                 {prdoption:"취미"},
                 {prdoption:"도서"},
                 {prdoption:"식품"},
                 {prdoption:"기타중고"},
                ];

//페이징 함수 호출
paging("/");
paging("/prdlist");
paging("/prdlist/all");
paging("/prdlist/1",prdobject[0]);
paging("/prdlist/2",prdobject[1]);
paging("/prdlist/3",prdobject[2]);
paging("/prdlist/4",prdobject[3]);
paging("/prdlist/5",prdobject[4]);
paging("/prdlist/6",prdobject[5]);
paging("/prdlist/7",prdobject[6]);

//페이징 함수 정의
function paging(para,para2){
  //상품게시판 목록 페이지 get 요청
  app.get(para,async function(req,res){
    //사용자가 게시판에 접속 시 몇번 페이징 번호로 접속했는지 체크
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    // 한 페이지당 보여줄 데이터 갯수
    let perPage = 12;
    // 한 블록당 보여줄 페이징 번호 갯수
    let blockCount = 5;
    // 현재 페이지 블록 구하기 
    let blockNum = Math.ceil(pageNumber / blockCount);
    //블록안에 있는 페이징의 시작번호값 알아내기
    let blockStart = ((blockNum - 1) * blockCount) + 1;
    //블록안에 있는 페이징의 끝번호값 알아내기
    let blockEnd = blockStart + blockCount - 1;
    //데이터 베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어
    let totalData = await db.collection("prdlist").countDocuments({});
    //전체 데이터 값을 통해서 몇개의 페이징 번호가 만들어져야 하는지
    let paging = Math.ceil(totalData / perPage);
    //만약 블록안에있는 페이징의 끝 번호값이 전체 페이징 갯수보다 많다면 강제로 마지막 페이징 번호값으로 변경
    if(blockEnd > paging){
        blockEnd = paging;
    }
    //블록의 총 갯수
    let totalBlock = Math.ceil(paging / blockCount);
    //데이터베이스에 실제 값을 꺼내기 위해 몇개씩 꺼내올건지 설정 sort / skip / limit
    let startFrom = (pageNumber - 1) * perPage
      //db안에 게시글 콜렉션 찾아서 데이터 전부 꺼내오고 ejs파일로 응답
      db.collection("prdlist").find(para2).sort({prdid:-1}).skip(startFrom).limit(perPage).toArray(function(err,result){
          res.render("index",{prdData:result,
                                userData:req.user,
                                paging:paging,
                                pageNumber:pageNumber,
                                blockStart:blockStart,
                                blockEnd:blockEnd,
                                blockNum:blockNum,
                                totalBlock:totalBlock
          })
      });
  });
}


//상품게시판 작성 페이지 
app.get("/prdinsert",function(req,res){
    res.render("prdinsert",{userData:req.user});
});




//게시글 작성후 데이터베이스에 넣는 작업 요청
app.post("/addprd",upload.single('addfile'),function(req,res){
    //db에 접근해서 게시글 입력처리
    //moment 사용해서 현재시간 입력
    //조건문으로 파일첨부시 첨부 파일명 / 없으면 null값을 넣어준다.
    if(req.file){
        fileUpload = req.file.originalname;
    }
    else{
        fileUpload = null;
    }

    let time = moment().format("YYYY.MM.DD");
    db.collection("count").findOne({name:"상품등록"},function(err,result){
        db.collection("prdlist").insertOne({
            prdid:result.prdCount+1,
            prdsubject:req.body.subject,
            prdcontext:req.body.context,
            prdauther:req.user.joinnick,
            prdlocal1:req.user.sido,
            prdlocal2:req.user.sigugun,
            prdprice:req.body.price,
            prdtime:time,
            prdfile:fileUpload,
            prdoption:req.body.prdoption,
            prdviews:0
        },function(err,result){
            db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},function(err,result){
                res.redirect("/prdlist");
            });
        });
    });
});

//게시글수정화면 페이지 
app.get("/prdupt/:no",function(req,res){
    //db안에 수정할 데이터 찾아서 ejs 파일로 응답
    db.collection("prdlist").findOne({prdid:Number(req.params.no)},function(err,result){
        res.render("prdupt",{prdData:result,userData:req.user});
    });
});

//수정후 업데이트
app.post("/update",upload.single('uptfile'),function(req,res){
    //db에 수정된 데이터 업데이트
    //첨부파일을 했다면 해당 파일의 파일명
    if(req.file){
        fileUpload = req.file.originalname;
    }
    else{
        fileUpload = req.body.originfile;
    }

    db.collection("prdlist").updateOne({prdid:Number(req.body.id)},{
        $set:{
            prdsubject:req.body.subject,
            prdcontext:req.body.context,
            prdoption:req.body.prdoption,
            prdprice:req.body.price,
            prdfile:fileUpload     
        }
    },function(err,result){
        res.redirect("/prddetail/" + req.body.id);
    });
});

//게시글삭제 페이지
app.get("/delete/:no",function(req,res){
    //db안에 데이터 삭제
    db.collection("prdlist").deleteOne({prdid:Number(req.params.no)},function(err,result){
        res.redirect("/prdlist");
    });
});

//게시글 상세화면 get 요청  /:변수명  작명가능
//db안에 해당 게시글번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
app.get("/prddetail/:no",function(req,res){
  db.collection("prdlist").updateOne({prdid:Number(req.params.no)},{$inc:{prdviews:1}},function(err,result){
    db.collection("prdlist").findOne({prdid:Number(req.params.no)},function(err,result1){
        //게시글 갖고오고 -> 해당 게시글 번호에 맞는 댓글들만 갖고오자
        db.collection("comment").find({comPrd:result1.prdid}).toArray(function(err,result2){
            //사용자에게 응답 ->게시글에 관련된 데이터 / 로그인 유저정보 / 댓글에 관련된 데이터
            res.render("prddetail",{prdData:result1,userData:req.user,commentData:result2});
        });
    });
  });
});

//뉴스 상세화면 get 요청  /:변수명  작명가능
//db안에 해당 게시글번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
app.get("/newsdetail/:no",function(req,res){
    db.collection("brdlist").findOne({num:Number(req.params.no)},function(err,result1){
      //사용자에게 응답 ->게시글에 관련된 데이터 / 로그인 유저정보 / 댓글에 관련된 데이터
      res.render("newsdetail",{newsData:result1,userData:req.user});
    });
});

//이벤트 상세화면 get 요청  /:변수명  작명가능
//db안에 해당 게시글번호에 맞는 데이터만 꺼내오고 ejs파일로 응답
app.get("/eventdetail/:no",function(req,res){
  db.collection("adlist").findOne({num:Number(req.params.no)},function(err,result1){
    //사용자에게 응답 ->게시글에 관련된 데이터 / 로그인 유저정보 / 댓글에 관련된 데이터
    res.render("eventdetail",{eventData:result1,userData:req.user});
  });
});

//댓글 작성 후 db에 추가하는 요청
app.post("/addcomment",function(req,res){
    //몇번 댓글인지 번호 부여하기위한 작업
    db.collection("count").findOne({name:"댓글"},function(err,result1){
        //해당 게시글의 번호값도 함께 부여!
        db.collection("prdlist").findOne({prdid:Number(req.body.prdid)},function(err,result2){
            //ex12_comment 콜렉션에 댓글을 집어넣기
            db.collection("comment").insertOne({
                comNo:result1.commentCount+1,
                comPrd:result2.prdid,
                comContext:req.body.comment_text,
                comAuther:req.user.joinnick,
                comDate:moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
            },function(err,result){
                db.collection("count").updateOne({name:"댓글"},{$inc:{commentCount:1}},function(err,result){
                    res.redirect("/prddetail/" + req.body.prdid);
                    //상세페이지에서 댓글 입력시 보내준 게시글 번호로 ->상세페이지 이동 요청
                });
            });
        });
    });
});

//댓글 업데이트 수정
app.post("/updatecomment",function(req,res){
    db.collection("comment").findOne({comNo:Number(req.body.comNo)},function(err,result1){
        db.collection("comment").updateOne({comNo:Number(req.body.comNo)},{$set:{comContext:req.body.comContext}},function(err,result){
            res.redirect("/prddetail/" + result1.comPrd);
        });
    });
});

//댓글 삭제 요청
app.get("/deletecomment/:no",function(req,res){
    //해당 댓글의 게시글 번호값을 찾아온 후 댓글을 삭제하고 난 다음에는 해당 상세페이지로 다시 이동
    db.collection("comment").findOne({comNo:Number(req.params.no)},function(err,result1){
        db.collection("comment").deleteOne({comNo:Number(req.params.no)},function(err,result2){
            //댓글 삭제 후 findOne으로 찾아온 comPrd
            res.redirect("/prddetail/" + result1.comPrd);
        });
    });
});

//마이페이지(회원정보 수정) 페이지 요청 경로
app.get("/my",function(req,res){
    res.render("mypage",{userData:req.user});
  });

  //마이페이지에서 입력한 데이터를 db에 수정반영 처리
  app.post("/myupdate",function(req,res){
    //회원정보 콜렉션에 접근해서 해당 아이디에 맞는 
    //비번 닉네임 이메일 주소 전화번호 수정한 것 변경처리 updateOne

    //원래는 mypage.ejs파일에서 원래 비밀번호 입력창과 /변경할 비밀번호 입력창
    //조건문으로 db에 있는 비밀번호와 mypage에서 입력한 원래 비밀번호가 일치하면
    //db 에 있는 비번 find
    
    db.collection("user").findOne({joinpass:req.body.originpass},function(err,result){
        if(result){
            db.collection("user").updateOne({joinid:req.user.joinid},{$set:{
                joinpass:req.body.userpass,
                joinnick:req.body.usernick,
                sido:req.body.city1,
                sigugun:req.body.city2,
            }},function(err,result){
                res.redirect("/");
            });
        }
        else{
            res.send("<script>alert('원래 비밀번호를 제대로 입력해주세요'); location.href='/my'; </script>");
        }
    });
  });