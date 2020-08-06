import React, { useState, useEffect } from 'react';
import jsonp from 'jsonp';
import moment from 'moment';
import "./index.css";

const m = {
    "00": "C2",
    "01": "C9",
    "02": "C1",
    "03": "C3",
    "04": "C3",
    "05": "C3",
    "06": "C3",
    "07": "C3",
    "08": "C3",
    "09": "C3",
    "10": "C3",
    11: "C3",
    12: "C3",
    13: "C4",
    14: "C4",
    15: "C4",
    16: "C4",
    17: "C4",
    18: "C5",
    19: "C3",
    20: "C7",
    21: "C3",
    22: "C3",
    23: "C3",
    24: "C3",
    25: "C3",
    26: "C4",
    27: "C4",
    28: "C4",
    29: "C7",
    30: "C7",
    31: "C7",
    53: "C6",
    99: "C8",
    32: "C5",
    49: "C5",
    54: "C6",
    55: "C6",
    56: "C6",
    57: "C5",
    58: "C5",
    301: "C3",
    302: "C4"
};

function Weather({ location }) {
    const [observe, setObserve] = useState(undefined)
    const [windOrHumidity, setWindOrHumidity] = useState(true)
    useEffect(() => {
        jsonp(`https://wis.qq.com/weather/common?source=pc&weather_type=forecast_1h|forecast_24h|alarm|limit|tips|rise|observe&province=${location["province"]["name"]}&city=${location["city"]["name"]}&county=`, {}, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                setObserve(data.data)
            }
        })
        let tick = setInterval(() => {
            setWindOrHumidity(!windOrHumidity)
        }, 5000);
        return () => {
            clearInterval(tick)
        }
    }, [])
    /**
     * 渲染小时预报
     * @param {Object} observe 
     */
    const hoursForecast = (observe) => {
        let keys = Object.keys(observe['forecast_1h']).sort((m, n) => {
            m = parseInt(m)
            n = parseInt(n)
            if (m > n) {
                return 1
            } else if (m < n) {
                return -1
            } else {
                return 0
            }
        }).slice(0, 25)
        let list = []
        keys.forEach((key) => {
            let day = observe['forecast_1h'][key]
            // 日期(0点 => 明天)
            let update_time = parseDate(day['update_time'])
            let time = update_time.format("HH") + ":" + update_time.format("mm")
            if (update_time.hour() == 0) {
                time = "明天"
            }
            // 日出/日落
            let sunrise = undefined
            let sunset = undefined
            // 白天或晚上
            let _dayOrNight = dayOrNight(update_time)
            let vise = getRise(Object.values(observe['rise']), update_time)
            if (vise) {
                // 日出
                if (vise["sunrise"].hour() == update_time.hour()) {
                    sunrise = vise["sunrise"].format("HH") + ":" + vise["sunrise"].format("mm")
                }
                if (vise["sunset"].hour() == update_time.hour()) {
                    sunset = vise["sunset"].format("HH") + ":" + vise["sunset"].format("mm")
                }
            }
            list.push(
                <li className="item" key={key} style={{ width: "3.84615%" }}>
                    <p className="txt-time">{time}</p>
                    <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/${_dayOrNight}/${day['weather_code']}.svg`} className="icon" />
                    <p className="txt-degree positive">{day['degree']}</p>
                </li>
            )
            if (sunrise) {
                list.push(
                    <li className="item keypoint" key="100" style={{ width: "3.84615%" }}><p className="txt-time">{sunrise}</p><img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/rise.svg" className="icon" /><p className="txt-key">日出</p></li>
                )
            }
            if (sunset) {
                list.push(
                    <li className="item keypoint" key="101" style={{ width: "3.84615%" }}><p className="txt-time">{sunset}</p><img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/set.svg" className="icon" /><p className="txt-key">日落</p></li>
                )
            }
        })
        while (list.length > 25) {
            list.pop()
        }
        return list
    }
    /**
     * 白天或晚上
     * @param {moment} date
     * @returns string
     */
    const dayOrNight = (date) => {
        let vise = getRise(Object.values(observe['rise']), date)
        if (vise) {
            if (vise['sunrise'].isBefore(date) && vise['sunset'].isAfter(date)) {
                return "day"
            } else {
                return "night"
            }
        }
        return "day"
    }
    /**
     * 解析时间
     * @param {moment} source 
     */
    const parseDate = (source) => {
        let format = ["YYYYMMDDHHmmss", "YYYYMMDD", "YYYYMMDDHHmm"];
        return moment(source, format, 'fr')
    }
    /**
     * 日出日落时间
     * @param {array} rise
     * @param {moment} date
     * @returns {"sunrise": {moment}, "sunset": {moment}} 
     */
    const getRise = (rise, date) => {
        if (!(rise instanceof Array)) {
            return undefined
        }
        for (let i = 0; i < rise.length; i++) {
            let time = parseDate(rise[i]['time'])
            if (time.day() == date.day() && time.month() == date.month()) {
                return {
                    'sunrise': parseDate(rise[i]['time'] + rise[i]['sunrise'].replace(":", "")),
                    'sunset': parseDate(rise[i]['time'] + rise[i]['sunset'].replace(":", ""))
                }
            }
        }
        return undefined
    }

    if (observe) {
        let current = observe['observe']
        let tomorrowForecast = observe['forecast_24h'][2]
        let todayForecast = observe['forecast_24h'][1]
        let mainClass = m[current['weather_code']] + " " + dayOrNight(moment())
        return (
            <div>
                <section id="sec-main" className={mainClass}>
                    <audio id="weather-audio" src=""></audio>
                    <p id="txt-location"><span id="icon-location"></span>{location["city"]["name"] + (location["district"] ? location["district"]["name"] : "")}</p>
                    <div id="ct-pub">
                        <p className="txt hide">中央气象台 {current['update_time'].substring(8, 10) + ":" + current['update_time'].substring(11, 12)}发布</p>
                    </div>
                    <p id="txt-temperature" className="positive">{current['degree']}</p>
                    <p id="txt-weather">{[current['weather']]}</p>
                    <div id="ct-wind-humidity">
                        <p className={windOrHumidity ? "show txt" : "txt"}>{todayForecast['day_wind_direction']} {todayForecast['day_wind_power']}级</p>
                        <p className={!windOrHumidity ? "show txt" : "txt"}>湿度 {current['humidity']}%</p>
                    </div>
                    <p id="txt-tips">{observe['tips']['observe'][0]}</p>
                    <div id="ct-landscape">
                        <div className="layer" id="layer1"></div>
                        <div className="layer" id="layer2"></div>
                        <div className="layer" id="layer3" style={{ transform: "translate3d(0px, 0px, 0px)" }}></div>
                    </div>
                    <div className="ct-aqi level2" data-boss="aqi">
                        <p id="til">72</p>
                        <p id="value">良</p>
                    </div>
                    <div className="ct-pop-window">
                        <div className="bg-cover"></div>
                        <div className="ct-window">
                            <h3 className="title"></h3>
                            <p className="txt-info"></p>
                            <button className="btn-close">我知道了</button>
                        </div>
                    </div>
                    <div className="ct-pop-window">
                        <div className="bg-cover"></div>
                        <div id="ct-air-pop" className="ct-window levelundefined full">
                            <div id="ct-main">
                                <a id="icon-close"></a>
                                <p id="titl">空气质量指数</p>
                                <p id="val"></p>
                                <p id="level"></p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="sec-tomorrow" className="container">
                    <div className="item">
                        <div className="top">
                            <p className="date">今天</p>
                            <p className="temperature">{todayForecast['max_degree']}/{todayForecast['min_degree']}&deg;</p>
                        </div>
                        <div className="bottom">
                            <p className="weather">{todayForecast['day_weather']}</p>
                            <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${todayForecast['day_weather_code']}.svg`} className="logo" />
                        </div>
                    </div>
                    <div className="item">
                        <div className="top">
                            <p className="date">明天</p>
                            <p className="temperature">{tomorrowForecast['max_degree']}/{tomorrowForecast['min_degree']}&deg;</p>
                        </div>
                        <div className="bottom">
                            <p className="weather">{tomorrowForecast['day_weather']}</p>
                            <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${tomorrowForecast['day_weather_code']}.svg`} className="logo" />
                        </div>
                    </div>
                </section>
                <section id="sec-hours" className="container">
                    <div id="ct-scroll" style={{ width: "400%" }}>
                        <ol id="ls-hours-weather">
                            {hoursForecast(observe)}
                        </ol>
                    </div>
                </section>
            </div>
        )
    } else {
        return (<div></div>)
    }

}

export default Weather