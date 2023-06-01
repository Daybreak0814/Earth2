// ==UserScript==
// @name : Raid Info Extractor
// @version : 0.1.3
// @description : 레이드 관련 알림 정보를 CSV파일로 추출합니다.
// @licence : GPL 3.0
// @author : Daybreak★새벽(존버방, 디스코드)


(async function () {

    async function getNotification() {
        try {
            let res = await fetch('https://app.earth2.io/api/v2/my/messages/?items=9999&limit=9999&message_class=NOTIFICATION&offset=0', {
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
            res = await res.json();
            return res;

        } catch (e) {
            console.log(e);
        };
    };

    const raidLogs = [
        ["DATE", "MY_PROPERTY", "RAID", "CYDROIDS", "E-THER", "OPPONENT_PROPERTY", "OPPONENT_USERNAME"],
        ['스크립트 제작 : Daybreak★새벽']
    ];

    const notiData = await getNotification();
    let successfulCount = 0; // SUCCESSFUL 이벤트 개수
    let totalCount = 0; // SUCCESSFUL + FAILED 이벤트 개수


    let totalEther = 0; // 총 E-THER 합계
    for (const result of notiData.results) {
        if (result.event_type !== "DROID_RAID_SUCCESSFUL" && result.event_type !== "DROID_RAID_FAILED") {
            continue;
        }
        const data = result.data;
        const opponent = data.victim;
        const home = data.homeLandfield;
        const enemy = data.enemyLandfield;
        let date = result.created.split('.')[0];
        date = new Date(result.created).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });


        const etherAmount = parseFloat(data.etherAmount); // E-THER 양
        if (!isNaN(etherAmount)) { // E-THER 값이 올바른 경우에만 총 E-THER 합계 계산
            totalEther += etherAmount; // 총 E-THER 합계 업데이트
        }

        raidLogs.push([
            date,
            `"${home.description}"`,
            result.event_type === "DROID_RAID_SUCCESSFUL" ? "SUCCESSFUL" : "FAILED",
            data.droidsCount,
            data.etherAmount,
            `"${enemy.description}"`,
            opponent.username
        ]);
        if (result.event_type === "DROID_RAID_SUCCESSFUL") {
            successfulCount += 1;
        }
        totalCount += 1;
    };

    raidLogs.push(['Total', '', '', '', totalEther.toFixed(2), '', '']);
    const successRate = totalCount > 0 ? (successfulCount / totalCount * 100).toFixed(2) + '%' : 'N/A'; // 승률 계산
    raidLogs.push(['Winning Rate', '', successRate, '', '', '', '']); // A열 가장 아랫줄에 '승률' 추가, E열 가장 아랫줄에 승률 표시
    raidLogs.push(['바이낸스 가입하고 코인 받기']);
    raidLogs.push(['https://bit.ly/daybreak_vip']);

    const today = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    const filename = `Raid${today}.csv`;

    // CSV 변환, 다운로드
    const csvString = raidLogs.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    console.log("다운로드 완료");

})();
