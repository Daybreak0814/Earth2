// ==UserScript==
// @name : Earth 2 Cydroids, Civilians counter
// @description : 생성가능한 Cydroids, Civilians 개수와 필요한 에테르 계산
// @licence : MIT
// @author : Daybreak★새벽 / Daybreak#5428(Discord)


(async function () {

    const id = auth0user.id;
    let propertyCount = 0;
    let page = 1;
    let mynickname = "Daybreak★새벽";
    let civPropertycount = 0;
    let tileCount = [];

    async function getProperty(page, id) {
        let res = await fetch(`https://r.earth2.io/landfields?items=60&page=${page}&search=&sort=-size&userId=${id}`, {
            "headers": {
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

    async function droidperproperty(tile) {
        if (tile >= 750) return 10;
        if (tile >= 650) return 9;
        if (tile >= 475) return 8;
        if (tile >= 325) return 7;
        if (tile >= 200) return 6;
        if (tile >= 100) return 5;
        if (tile >= 60) return 4;
        if (tile >= 30) return 3;
        if (tile >= 10) return 2;
        if (tile >= 4) return 1;
    }

    async function getDroidCount() {
        let droid = 0;
        for (let i = 0; i < tileCount.length; i++) {

            await droidperproperty(tileCount[i]).then(r => {
                droid += r;
            })
        }
        return droid;
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
            console.log(`데이터 로딩... ${page}페이지 ${mynickname}`);
        } else if (page % 2 == 1) {
            console.log(`데이터 로딩... ${page}페이지 ${mynickname.replaceAll("□", "■")}`);
        }

        await getProperty(page, id).then(r => {
            for (let i = 0; i < r.data.length; i++) {
                if (r.data[i].attributes.tileCount < 4) {
                    minproperty = false;
                    console.log("4타일 이상 프로퍼티 로딩 완료");
                    break;
                }
                tileCount.push(r.data[i].attributes.tileCount);
                civPropertycount++;
            }
        }).catch((e) => {
            console.log(page + "페이지 로딩 오류");
        });
        await delay(333);
        page++;
    }

    let civCount = civPropertycount * 5;
    let ether = civCount * 20;
    let esnc = ether * 0.065;
    let totalDroid = await getDroidCount();
    let droidesnc = totalDroid * 7.5;
    let droidJewel = totalDroid * 3;
    console.log(`최대 드로이드 ${totalDroid}개 | 에센스 ${droidesnc}개 | 3티 주얼 ${droidJewel}개`
        + "\n" + `최대 시빌리언 ${civCount}개 | 에테르 ${ether}개 = 에센스 ${esnc}개`
        + "\n" + "드로이드에 필요한 에센스는 충전비용(5) 포함이며 모든 수치는 변경될 수 있음"
        + "\n" + "%cS%cc%cr%ci%cp%ct %cb%cy %cD%ca%cy%cb%cr%ce%ca%ck★%c새벽",
        "color:green;", "color:red;", "color:orange;", "color:red;", "color:green;",
        "color:blue;", "color:indigo;", "color:violet;", "color:purple;", "color:pink;",
        "color:red;", "color:orange;", "color:red;", "color:green;", "color:blue;",
        "color:indigo;", "color:violet;");

})();         
