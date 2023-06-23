// ==UserScript==
// @name : Civilian Level Counter
// @version : 0.1.2
// @description : 레벨별 시빌리언 인원수와 퍼센티지를 알려줍니다
// @licence : MIT
// @author : Daybreak★새벽 | 디스코드 : e2daybreak


(async function () {

    let civilianLevels = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };

    let url = "https://r.earth2.io/civilians?page=1&q=&sortBy=name&sortDir=asc";

    async function getCivilianData() {
        try {
            let response = await fetch(url, {
                "headers": {
                    "x-csrftoken": document.getElementsByName("csrfmiddlewaretoken")[0].value
                },
                "credentials": "include"
            });
            let data = await response.json();

            let totalPages = data.meta.pages;
            let totalCivilians = data.meta.count;

            for (let i = 1; i <= totalPages; i++) {
                console.log(`Loading page ${i} of ${totalPages}... %c[Advertise here]`, 'color:red');
                let pageUrl = `https://r.earth2.io/civilians?page=${i}&q=&sortBy=name&sortDir=asc`;
                let pageResponse = await fetch(pageUrl, {
                    "headers": {
                        "x-csrftoken": document.getElementsByName("csrfmiddlewaretoken")[0].value
                    },
                    "credentials": "include"
                });
                let pageData = await pageResponse.json();

                for (let item of pageData.data) {
                    let level = item.attributes.level;

                    if (level >= 1 && level <= 6) {
                        civilianLevels[level]++;
                    }
                }

                if (i % 10 === 0) {
                    await delay(1000);
                }

                if (i % 100 === 0) {
                    console.log('[쿨타임] 30초 대기');
                    await delay(30000);
                }
            }
            console.log('Data loading complete.\n\n[ Civilian Count and Percentage by Level ]');
            for (let level = 1; level <= 6; level++) {
                let percentage = (civilianLevels[level] / totalCivilians) * 100;
                console.log(`Level ${level} : ${civilianLevels[level]} (${percentage.toFixed(2)}%)`);
            }
            console.log(`Total : ${totalCivilians}`);
            console.log('\n스크립트 작성 : Daybreak★새벽 | 문의 : 디스코드 e2daybreak');
            console.log('스크립트/데이터/마켓정보 구독 https://patreon.com/e2daybreak');
        } catch (err) {
            console.error(err);
        }
    }

    getCivilianData();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
