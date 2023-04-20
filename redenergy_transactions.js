// ==UserScript==
// @name : Display RED ENERGY TRANSACTIONS
// @version : 0.2.3
// @description : Show the Red Energy records by date
// @licence : MIT
// @author : Daybreak★새벽
// update : added cool time
// update : added tiles purchased
// update : utc -> kst

(async function () {

    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    const url = "https://r.earth2.io/transactions/resources";
    let params = { page: 1, items: 100, ticker: "REDEN", type: "RED_ENERGY_REWARD" };
    let params2 = { page: 1, items: 100, ticker: "REDEN", type: "RED_ENERGY_UNLOCKED_LAND" }
    let transactions = {};
    const startDate = "2023-04-01";

    const fetchTransactions = async () => {

        const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
            credentials: "include",
            headers: { "x-csrftoken": csrftoken },
        });

        const { total: totalpages } = await response.json();
        total = parseInt(totalpages);

        while (true) {

            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                credentials: "include",
                headers: { "x-csrftoken": csrftoken },
            });

            const processed = params.page * params.items;
            count = processed > total ? total : processed;
            console.log(`Loading RED ENERGY REWARD ${count} / ${total} - When E2V1 When 상장`);

            const { data } = await response.json();

            for (const transaction of data) {
                // const date = transaction.created.substring(0, 10);
                const date = new Date(Date.parse(transaction.created) + 9 * 60 * 60 * 1000).toISOString().substring(0, 10);
                const amount = parseFloat(transaction.amount);

                if (transactions[date]) {
                    transactions[date] += amount;
                } else {
                    transactions[date] = amount;
                }
            }

            if (data.length < params.items) {
                break;
            }

            params.page++;

            if (count % 1000 === 0) {
                console.log(`Pausing for 1 seconds... 쿨타임입니다 잠시 기다려주세요`);
                await sleep(1000);
            }

            if (count % 10000 === 0) {
                console.log(`Pausing for 30 seconds... 쿨타임입니다 잠시 기다려주세요`);
                await sleep(30000);
            }

            if (count % 40000 === 0) {
                console.log(`Pausing for 60 seconds... 쿨타임입니다 잠시 기다려주세요`);
                await sleep(60000);
            }
        }



        let reUnlockedAmount = 0;
        const response2 = await fetch(`${url}?${new URLSearchParams(params2)}`, {
            credentials: "include",
            headers: { "x-csrftoken": csrftoken },
        });

        const { total: totalpages2 } = await response2.json();
        total = parseInt(totalpages2);


        while (true) {
            const response = await fetch(`${url}?${new URLSearchParams(params2)}`, {
                credentials: "include",
                headers: { "x-csrftoken": csrftoken },
            });
            const processed = params2.page * params2.items;
            const count = processed > total ? total : processed;
            console.log(`Loading RED ENERGY UNLOCKED LAND ${count} / ${total} - When E2V1 When 상장`);
            const { data } = await response.json();

            for (const transaction of data) {
                reUnlockedAmount += parseFloat(transaction.amount);
            }

            if (data.length < params2.items) {
                break;
            }

            params2.page++;
        }


        let totalAmount = 0;
        let amountAfterstartdate = 0
        let numDays = 0;

        const dates = Object.keys(transactions).reverse();

        for (const date of dates) {
            if (date < startDate) {
                totalAmount += transactions[date];
                console.log(`${date}: ${transactions[date].toFixed(2)} RED ENERGY`);
            } else {
                console.log(`${date}: ${transactions[date].toFixed(2)} RED ENERGY`);
                totalAmount += transactions[date];
                amountAfterstartdate += transactions[date]
                numDays++;
            }
        }

        const averageAmount = amountAfterstartdate / numDays;
        console.log(`\nAverage(4월 1일 이후) : ${averageAmount.toFixed(2)} RED ENERGY`);
        console.log(`Total Reward : ${totalAmount.toFixed(2)} RED ENERGY`);
        console.log(`Total Unlocked Land : ${reUnlockedAmount} RED ENERGY (${-reUnlockedAmount / 3} tiles)`);
        console.log('\n*위의 날짜는 UTC 기준으로 알람창으로 보여지는 수치와 다를 수 있습니다.'
            + '\n*RED ENERGY UNLOCKED LAND는 타일 구매로 사용한 레드 에너지입니다'
            + '\n스크립트 제작 : Daybreak★새벽');

    }

    fetchTransactions();


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();
