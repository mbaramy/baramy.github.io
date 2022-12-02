/* 선택한 환수를 객체로 변환 */
function parseSelectedItem(data) {
    var result = [];
    for (var i=0; i<data.length; i++) {
        var obj = {};
        obj.ic = data.eq(i).attr('data-id');
        obj.name = data.eq(i).attr('data-name');
        obj.influence = data.eq(i).attr('data-influence');
        obj.type = data.eq(i).attr('data-type');
        obj.grade = data.eq(i).attr('data-grade');
        
        var level = 0;
        var input = parseInt(data.eq(i).find('.mob-level').val());
        if (input > level) { level = input; }
        obj.level = level;
        
        const option = getOption(optionObj[obj.ic], level);
        obj.option = option.o;
        obj.equip_option = option.e;

        console.log(obj);
        result.push(obj);
    }
    return result;
}

function getOption(option, level) {
    var result = {};
    var optionObj = {};
    var equipObj = {};
    for (var key of Object.keys(option)) {
        const value = option[key][level];
        optionObj[key] = value;

        const rate = getRate(key, level);
        var equipValue =  Math.floor(value * rate);
        if (equipValue < 1) equipValue = 1;
        equipObj[key] = equipValue;
    }
    result.o = optionObj;
    result.e = equipObj;
    return result;
}

function getRate(key, level) {
    //0~8: 0
    //9~13: 1
    //14~16: 2
    var rate = 0;
    if (level > 8 && level < 14) {
        rate = 1;
    } else if (level > 13) {
        rate = 2;
    }

    for (var i=0; i<optionRate.length; i++) {
        if (optionRate[i].name == key) {
            let value = optionRate[i]['rate' + rate];
            if (value == '') value = 0;
            return value;
        }
    }

    return 0;
}

const UNITE_EQUIP_EFFECT = 0;
const UNITE_OPTION = 1;

const uniteInfo = {
    "수호": [{"보물": [{"일반몬스터 추가피해": 50}, {"일반몬스터 추가피해": 50, "경험치 획득증가": 3}, {"일반몬스터 추가피해": 50, "경험치 획득증가": 3, "피해저항관통": 50}], "전설": [{"위력": 150}, {"위력": 150, "경험치 획득증가": 10}, {"위력": 150, "경험치 획득증가": 10, "피해저항관통": 100}]}, 
    {"결의": [{"피해저항": 50, "일반몬스터 추가피해": 100, "경험치 획득증가": 4},{"피해저항": 80, "일반몬스터 추가피해": 150, "경험치 획득증가": 6},{"피해저항": 130, "일반몬스터 추가피해": 250, "경험치 획득증가": 10}], "고요": [{"피해저항": 50, "보스몬스터 추가피해": 100, "경험치 획득증가": 4},{"피해저항": 80, "보스몬스터 추가피해": 150, "경험치 획득증가": 6},{"피해저항": 130, "보스몬스터 추가피해": 250, "경험치 획득증가": 10}], "의지": [{"피해저항": 50, "치명피해저항": 100, "경험치 획득증가": 4},{"피해저항": 80, "치명피해저항": 150, "경험치 획득증가": 6},{"피해저항": 130, "치명피해저항": 250, "경험치 획득증가": 10}], "침착": [{"피해저항관통": 30, "피해흡수": 700, "경험치 획득증가": 4},{"피해저항관통": 50, "피해흡수": 1200, "경험치 획득증가": 6},{"피해저항관통": 80, "피해흡수": 2000, "경험치 획득증가": 10}], "냉정": [{"피해저항관통": 30, "대인방어": 1000, "경험치 획득증가": 4},{"피해저항관통": 50, "대인방어": 1500, "경험치 획득증가": 6},{"피해저항관통": 80, "대인방어": 2500, "경험치 획득증가": 10}], "활력": [{"피해저항관통": 30, "시전향상": 100, "경험치 획득증가": 4},{"피해저항관통": 50, "시전향상": 150, "경험치 획득증가": 6},{"피해저항관통": 80, "시전향상": 250, "경험치 획득증가": 10}]}],
    
    "탑승": [{"보물": [{"일반몬스터 추가피해": 20}, {"일반몬스터 추가피해": 20, "보스몬스터 추가피해": 20}, {"일반몬스터 추가피해": 20, "보스몬스터 추가피해": 20, "피해저항관통": 20}], "전설": [{"일반몬스터 추가피해": 50}, {"일반몬스터 추가피해": 50, "보스몬스터 추가피해": 50}, {"일반몬스터 추가피해": 50, "보스몬스터 추가피해": 50, "피해저항관통": 50}]}, 
    {"결의": [{"마력증가%": 1, "치명위력": 250, "시전항상": 60},{"마력증가%": 1, "치명위력": 500, "시전항상": 90},{"마력증가%": 2, "치명위력": 750, "시전항상": 150}], "고요": [{"체력증가%": 1, "치명확률": 200, "파괴력증가": 7000},{"체력증가%": 1, "치명확률": 400, "파괴력증가": 12000},{"체력증가%": 2, "치명확률": 600, "파괴력증가": 15000}], "의지": [{"마력증가%": 1, "피해흡수": 500, "치명피해저항": 60},{"마력증가%": 1, "피해흡수": 700, "치명피해저항": 90},{"마력증가%": 2, "피해흡수": 1200, "치명피해저항": 150}], "침착": [{"마력증가%": 1, "마력회복향상": 3, "피해증가": 5},{"마력증가%": 1, "마력회복향상": 4, "피해증가": 7},{"마력증가%": 2, "마력회복향상": 7, "피해증가": 12}], "냉정": [{"체력증가%": 1, "대인방어": 600, "치명위력%": 5},{"체력증가%": 1, "대인방어": 900, "치명위력%": 7},{"체력증가%": 2, "대인방어": 1500, "치명위력%": 12}], "활력": [{"체력증가%": 1, "체력회복향상": 3, "위력": 50},{"체력증가%": 1, "체력회복향상": 4, "위력": 70},{"체력증가%": 2, "체력회복향상": 7, "위력": 120}]}],
    
    "변신": [{"보물": [{"일반몬스터 추가피해": 50}, {"일반몬스터 추가피해": 50, "피해증가": 5}, {"일반몬스터 추가피해": 50, "피해증가": 5, "피해저항관통": 50}], "전설": [{"마력증가%": 3}, {"마력증가%": 3, "체력증가%": 3}, {"마력증가%": 3, "체력증가%": 3, "피해저항관통": 100}]}, 
    {"결의": [{"피해저항관통": 30, "피해흡수": 700, "이동속도": 1},{"피해저항관통": 50, "피해흡수": 1200, "이동속도": 1},{"피해저항관통": 80, "피해흡수": 2000, "이동속도": 3}], "고요": [{"피해저항관통": 30, "대인방어": 1000, "이동속도": 1},{"피해저항관통": 50, "대인방어": 1500, "이동속도": 1},{"피해저항관통": 80, "대인방어": 2500, "이동속도": 3}], "의지": [{"피해저항": 50, "치명피해저항": 120, "이동속도": 1},{"피해저항": 80, "치명피해저항": 200, "이동속도": 1},{"피해저항": 130, "치명피해저항": 300, "이동속도": 3}], "침착": [{"피해저항": 50, "일반몬스터 추가피해": 120, "이동속도": 1},{"피해저항": 80, "일반몬스터 추가피해": 200, "이동속도": 1},{"피해저항": 130, "일반몬스터 추가피해": 300, "이동속도": 3}], "냉정": [{"피해저항관통": 30, "시전향상": 100, "이동속도": 1},{"피해저항관통": 50, "시전향상": 150, "이동속도": 1},{"피해저항관통": 80, "시전향상": 250, "이동속도": 3}], "활력": [{"피해저항": 50, "보스몬스터 추가피해": 120, "이동속도": 1},{"피해저항": 80, "보스몬스터 추가피해": 200, "이동속도": 1},{"피해저항": 130, "보스몬스터 추가피해": 300, "이동속도": 3}]}]
};

function getRecommendData(t, s, b) {
    var result_t = [];
    var result_s = [];
    var result_b = [];

    if (t.length > 4) {
        for (var i=0; i<t.length; i++) {
            var equipOption = {};

        }
    } else {
        result_t = t;
    }
}

