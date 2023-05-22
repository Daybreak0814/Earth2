// ==UserScript==
// @name : Civilian counter
// @version : 0.1.1
// @description : 생성 가능한 최대 시빌리언 개수와 비용 계산
// @licence : MIT
// @author : Daybreak★새벽 / Daybreak#5428(Discord)


(async function () {

    const id = auth0user.id;
    let propertyCount = 0;
    let page = 1;
    const mynickname = "Daybreak★새벽";
    let civPropertycount = 0;

    async function getProperty(page, id) {
        let res = await fetch(`https://r.earth2.io/landfields?items=60&page=${page}&search=&sort=-size&userId=${id}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "if-none-match": "W/\"438bf420f0c924bf1d4785abddc1e1e6\"",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-csrftoken": document.getElementsByName("csrfmiddlewaretoken")[0].value
            },
            "referrer": "https://app.earth2.io/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return await res.json();
    }

    async function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }


    await getProperty(page, id).then(r => {
        propertyCount = r.meta.count;
    });


    let minproperty = true;
    while (propertyCount > (page * 60) - 60 && minproperty) {
        if (page % 2 == 0) {
            console.log(`데이터 로딩... ${page}페이지 / ${mynickname}`);
        } else if (page % 2 == 1) {
            console.log(`데이터 로딩... ${page}페이지 / ${mynickname.replaceAll("★", "☆")}`);
        }

        await getProperty(page, id).then(r => {
            for (let i = 0; i < r.data.length; i++) {
                if (r.data[i].attributes.tileCount < 4) {
                    minproperty = false;
                    console.log("4타일 이상 프로퍼티 로딩 완료");
                    break;
                }
                civPropertycount++;
            }
        }).catch((e) => {
            console.log(page + "페이지 로딩 오류");
        });
        await delay(333);
        page++;
    }

    const civPerproperty = 3; //프로퍼티당 시빌리언 수치 변경 가능
    const civCount = civPropertycount * civPerproperty;
    const ether = civCount * 25;
    const redenergy = civCount * 4;
    const esnc = ether * 0.065;

    console.log(`최대 시빌리언 ${civCount}개` + '\n'
        + `에테르 ${ether}개(에센스 ${esnc}개)` + '\n'
        + `레드 에너지 ${redenergy}개` + '\n'
        + `(프로퍼티당 시빌리언 ${civPerproperty}명 기준)` + '\n\n'
        + '스크립트 제작 : Daybreak★새벽' + '\n\n'
        + '바이낸스 가입하고 디센,샌박 코인 받기 https://bit.ly/daybreak_vip');

})();      
