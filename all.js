//DOM選取
const loader = document.querySelector('.loader');
const content = document.querySelector('.content');
const select_area = document.querySelector('.select-area');
const select_site = document.querySelector('.select-site');
const ingredient = document.querySelector('.ingredient');
const title = document.querySelector('.title');
const card = document.querySelector('.card-item');
const time = document.querySelector('.time');




//非同步
(async () => {
    //拿API
    const jsonUrl = 'https://script.google.com/macros/s/AKfycbzl6KKgb4v2-F3SCVxVaXjnMwM_XQvnk2A08nw7NjmGfuRVmak0/exec?url=http://opendata2.epa.gov.tw/AQI.json';
    const res = await fetch(jsonUrl, { method: 'get' })
        .then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        })



    //loader切換
    loader.classList.add('d-none');
    content.classList.remove('d-none');


    //color狀態管理
    let color = '';
    res.forEach(item => {
        const num = item.AQI;
        switch (true) {
            case num <= 50:
                color = 'rgb(140, 195, 36)';
                break;
            case num > 50 && num <= 100:
                color = 'rgb(244, 228, 92)';
                break;
            case num > 100 && num <= 150:
                color = 'rgb(237, 176, 53)';
                break;
            case num > 150 && num <= 200:
                color = 'rgb(239, 119, 67)';
                break;
            case num > 200 && num <= 300:
                color = 'rgb(204, 66, 79)';
                break;
            case num > 300 && num <= 400:
                color = 'rgb(129, 65, 149)';
                break;
        }
    })



    //display資料
    const displaySite = (res) => {
        let str = '';
        res.forEach((item) => {
            str += `
    <div class="col-xl-1 col-md-2 mb-5 mr-5 py-4 area-item shadow rounded d-flex flex-column align-items-center justify-content-between" style="border-color:${color}">
        <h4 class="l-s name m-0 pb-4">${item.SiteName}</h4>
        <h4 class="w-100 text-center m-0 pt-4" style="border-top:2px #eee solid;">${item.AQI}</h4>
    </div>
    `;
        });
        card.innerHTML = str;
    }

    const displayCompose = (res) => {
        let str = '';
        res.forEach((item) => {
            str += `<table class="table table-striped shadow">
            <tbody>
                <tr style="background-color:${color}">
                    <td class="l-s"><span class="h4">${item.SiteName}</span> 監測站</td>
                    <td class="h4">${item.AQI}</td>
                </tr>
                <tr>
                    <td>臭氧 O<sub>3</sub></td>
                    <td class="text-left"><big>${item.O3}</big> <small>ppb</small></td>
                </tr>
                <tr>
                    <td>懸浮微粒 PM<sub>10</sub></td>
                    <td class="text-left"><big>${item.PM10}</big> <small>μg/m<sup>3</sup></small></td>
                </tr>
                <tr>
                    <td>細懸浮微粒 PM<sub>2.5</sub></td>
                    <td class="text-left"><big>${item['PM2.5']}</big> <small>μg/m<sup>3</sup></small></td>
                </tr>
                <tr>
                    <td>一氧化碳 CO</td>
                    <td class="text-left"><big>${item.CO}</big> <small>ppm</small></td>
                </tr>
                <tr>
                    <td>二氧化硫 SO<sub>2</sub></td>
                    <td class="text-left"><big>${item.SO2}</big> <small>ppb</small></td>
                </tr>
                <tr>
                    <td>二氧化氮 NO<sub>2</sub></td>
                    <td class="text-left"><big>${item.NO2}</big> <small>ppb</small></td>
                </tr>
            </tbody>
        </table> `;
        });
        ingredient.innerHTML = str;
    }



    //init資料與畫面
    const renderSelect = (res) => {
        let noRepeat = [];
        res.forEach((items) => {
            if (noRepeat.indexOf(items.County) === -1) {
                noRepeat.push(items.County);
            }
        })
        let str = '';
        noRepeat.forEach((item) => {
            str += `
            <option value="${item}">${item}</option>`;
        })
        select_area.innerHTML = str;
    }

    const renderSelect2 = (res) => {
        let sites = [];
        res.forEach((item) => {
            sites.push(item.SiteName);
        })
        let str = '';
        sites.forEach((item) => {
            str += `
            <option value="${item}">${item}</option>`
        })
        select_site.innerHTML = str;
    }

    const renderSite = (res) => {
        let area = '';
        let areaSite = [];
        res.forEach((item) => {
            if ('基隆市' === item.County) {
                area = item.County;
                areaSite.push(item);
            }
        })
        title.innerHTML = area;
        displaySite(areaSite);
    }

    const renderCompose = (res) => {
        let compose = res.filter((item, index) => {
            return index === 0;
        })
        let updateTime = '';
        res.forEach(item => {
            updateTime = item.PublishTime;
        })
        displayCompose(compose);
        time.innerHTML = updateTime;
    }


    renderSelect(res);
    renderSelect2(res);
    renderSite(res);
    renderCompose(res);


    //事件觸發
    select_area.addEventListener('change', (e) => {
        let area = '';
        let areaItem = [];
        res.forEach((item) => {
            if (e.target.value === item.County) {
                area = item.County;
                areaItem.push(item);
            }
        })
        title.innerHTML = area;
        displaySite(areaItem);
        renderSelect2(areaItem);
        renderCompose(areaItem);
    });


    select_site.addEventListener('change', (e) => {
        let siteItem = [];
        res.forEach((item) => {
            if (e.target.value === item.SiteName) {
                siteItem.push(item);
            }
        })
        displayCompose(siteItem);
    });

    card.addEventListener('click', (e) => {
        if (e.target.nodeName !== 'H4') return;
        let compose = [];
        res.forEach((item) => {
            if (e.target.textContent === item.SiteName) {
                compose.push(item);
            }
        })
        displayCompose(compose);
    })
})();


