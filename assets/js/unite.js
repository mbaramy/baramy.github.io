var optionObj = {};
var optionRate = [];

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
        if (level > 15) level = 15;
        obj.level = level;
        
        const option = getOption(optionObj[obj.ic], level);
        obj.option = option.o;
        obj.equip_option = option.e;
        result.push(obj);
    }
    return result;
}

function getOption(option, level) {
    var result = {};
    var optionObj = {};
    var equipObj = {};
    var isEmpty = true;
    for (var key of Object.keys(option)) {
        const value = option[key][level];
        optionObj[key] = value;
        if (option[key][0] != option[key][15] && isEmpty) isEmpty = false;

        const rate = getRate(key, level);
        var equipValue =  Math.floor(value * rate.value);
        if (rate.roundup <= rate.index && equipValue < 1) equipValue = 1;
        equipObj[key] = equipValue;
    }
    result.o = optionObj;
    result.e = equipObj;
    result.isEmpty = isEmpty;
    return result;
}

function getRate(key, level) {
    //0~8: 0
    //9~13: 1
    //14~15: 2
    var rate = 0;
    if (level > 5 & level <= 8) {
        rate = 1;
    } else if (level > 8 && level <= 13) {
        rate = 2;
    } else if (level > 13) {
        rate = 3;
    }

    for (var i=0; i<optionRate.length; i++) {
        if (optionRate[i].name == key) {
            let value = optionRate[i]['rate' + rate];
            var roundup = optionRate[i].roundup;
            if (value == '') value = 0;
            if (roundup == '') roundup = 0;
            return {'index': rate, 'value': value, 'roundup': roundup};
        }
    }

    return {'index': rate, 'value': 0, 'roundup': 0, 'score': 0};
}

function scoreToDictionary(array, stat) {
    var result = {};
    for (var i=0; i<array.length; i++) {
        result[array[i]['name']] = parseFloat(array[i]['score']);
        if (stat == '체력' && array[i]['name'].indexOf('마력') > -1) result[array[i]['name']] = 0;
        else if (stat == '마력' && array[i]['name'].indexOf('체력') > -1) result[array[i]['name']] = 0;
    }
    return result;
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
const priorityInfo = ['피해저항관통', '피해저항', '경험치 획득증가'];

function getRecommendData(t, pa, pb) {
    if (t.length > 4) {
        var combine = combination(t, 4).map(function(c) {
            return getScore(c, pa, pb);
        });
        // .sort(function(a, b) {
        //     if (a.sum == b.sum) {
        //         if (a.priority == b.priority) {
        //             return b.score - a.score;
        //         } else {
        //             return b.priority - a.priority;
        //         }
        //     } else if (a.priority == b.priority) {
        //         if (a.sum == b.sum) {
        //             return b.score - a.score;
        //         } else {
        //             return b.sum - a.sum;
        //         }
        //     } else {
        //         return b.priority - a.priority;
        //     }
        // });

        var max = [0, 0, 0];
        var score = [0, 0, 0];
        var recommend = {'sum': {}, 'score': {}, 'priority': {}};
        for (var i=0; i<combine.length; i++) {
            if (combine[i].sum > max[0]) {
                max[0] = combine[i].sum;
                recommend['sum'] = combine[i];
            }

            if (combine[i].score > max[1]) {
                max[1] = combine[i].score;
                recommend['score'] = combine[i];
            }

            if (combine[i].priority >= max[2]) {
                if (combine[i].priority == max[2]) {
                    if (combine[i].score > score[2]) {
                        max[2] = combine[i].priority;
                        score[2] = combine[i].score;
                        recommend['priority'] = combine[i];
                    }
                } else {
                    max[2] = combine[i].priority;
                    score[2] = combine[i].score;
                    recommend['priority'] = combine[i];
                }
            }
        }
        return recommend;
    } else {
        return {};
    }
}

function combination(arr, count) {
    let result = [];
    count = count || 4;

    if (count === 1) return arr.map((i) => [i]);

    arr.forEach((fixed, index, array) => {
        const clone = array.slice(index + 1);
        const permutations = combination(clone, count - 1);
        const attached = permutations.map((permutation) => [fixed, ...permutation]);
        result.push(...attached);
    });
    return result;
}

function getScore(arr, pa, pb) {
    var result = {'unit': {}, 'grade': {}, 'priority': 0, 'sum': 0, 'score': 0, 'count': {'unit': {'결의': 0, '고요': 0, '의지': 0, '침착': 0, '냉정': 0, '활력': 0}, 'grade': {'보물': 0, '전설': 0}}, 'arr': arr};
    var unitObj = {'결의': 0, '고요': 0, '의지': 0, '침착': 0, '냉정': 0, '활력': 0};
    var gradeObj = {'보물': 0, '전설': 0};
    const scoreObj = scoreToDictionary(optionRate, pb);
    var type = '';
    for (var i=0; i<arr.length; i++) {
        if (type == '') type = arr[i].type;
        unitObj[arr[i].influence] += 1;
        result['count']['unit'][arr[i].influence] += 1;
        gradeObj[arr[i].grade] += 0.5;
        result['count']['grade'][arr[i].grade] += 1;
    }

    var info = uniteInfo[type];
    for (var k of Object.keys(unitObj)) {
        if (unitObj[k] > 1) {
            const val = info[UNITE_OPTION][k][unitObj[k] - 2];
            for (var key of Object.keys(val)) {
                if (key == pa) result['priority'] += val[key];
                if (key == priorityInfo[0]) result['sum'] += val[key];
                if (key == priorityInfo[1]) result['sum'] += val[key];
                if (val[key] > 0 && scoreObj[key] > 0) result['score'] += val[key] / scoreObj[key];
            }  
            unitObj[k] = val;
        } else {
            unitObj[k] = {};
        }
    }

    for (var k of Object.keys(gradeObj)) {
        if (gradeObj[k] > 0.5) {
            const val = info[UNITE_EQUIP_EFFECT][k][Math.floor(gradeObj[k])];
            for (var key of Object.keys(val)) {
                if (key == pa) result['priority'] += val[key];
                if (key == priorityInfo[0]) result['sum'] += val[key];
                if (key == priorityInfo[1]) result['sum'] += val[key];
                if (val[key] > 0 && scoreObj[key] > 0) result['score'] += val[key] / scoreObj[key];
            }
            gradeObj[k] = val;
        } else {
            gradeObj[k] = {};
        }
    }

    for (var k of Object.keys(unitObj)) {
        if (unitObj[k].length == 0) delete unitObj[k];
    }

    for (var k of Object.keys(gradeObj)) {
        if (gradeObj[k].length == 0) delete gradeObj[k];
    }

    result['unit'] = unitObj;
    result['grade'] = gradeObj;

    for (var i=0; i<arr.length; i++) {
        for (var key of Object.keys(arr[i].equip_option)) {
            if (key == pa) result['priority'] += arr[i].equip_option[key];
            if (key == priorityInfo[0]) result['sum'] += arr[i].equip_option[key];
            if (key == priorityInfo[1]) result['sum'] += arr[i].equip_option[key];
            if (arr[i].equip_option[key] > 0 && scoreObj[key] > 0) result['score'] += arr[i].equip_option[key] / scoreObj[key];
        }
    }

    return result;
}

function getResultHTML(obj) {
    var result = {'sum': '', 'score': '', 'priority': ''};
    for (var key of Object.keys(result)) {
        var gradeObj = {};
        var influenceObj = {};
        var equipObj = {};
        var totalObj = {};
        var mobTable = '<div class="mob-table-grid">';
        var gTable = '<div class="col-md-4"><h5 class="card-title under-line-highlight-pink">등급 세트 효과</h5><table class="table table-borderless"><tbody>';
        var iTable = '<div class="col-md-4"><h5 class="card-title under-line-highlight-sky">세력 세트 효과</h5><table class="table table-borderless"><tbody>';
        var eTable = '<div class="col-md-4"><h5 class="card-title under-line-highlight-yellow">장착 효과</h5><table class="table table-borderless"><tbody>';
        var tTable = '<div class="col-md-12"><table class="table table-borderless"><tbody>';

        if (!obj[key].arr) {
            result[key] = '<div style="min-height: 150px; text-align: center;"><h5 class="card-title">결과 없음</h5></div>';
        } else {
            for (var i=0; i<obj[key].arr.length; i++) {
                mobTable += '<div class="by-card"><div class="by-card-level">Level ' + obj[key].arr[i].level + '</div>';
                mobTable += '<div class="by-card-name">' + obj[key].arr[i].name + '</div>';
                mobTable += '<img class="by-card-img" src="assets/img/mob/ic_' + obj[key].arr[i].ic + '.jpg"/>';
                mobTable += '<div class="by-card-influence"><div class="by-card-influence-container"><div class="by-card-influence-name">';
                mobTable += '<img class="inf-img me-1 ' + getUniteBorder(obj[key].arr[i].influence) + '" src="assets/img/influence/ic_inf_' + getInfluenceImg(obj[key].arr[i].influence) + '.jpg"/>' + obj[key].arr[i].influence + '</div></div></div></div>';
    
                for (var option of Object.keys(obj[key].arr[i].equip_option)) {
                    if (equipObj[option]) equipObj[option] += obj[key].arr[i].equip_option[option];
                    else equipObj[option] = obj[key].arr[i].equip_option[option];

                    if (totalObj[option]) totalObj[option] += obj[key].arr[i].equip_option[option];
                    else totalObj[option] = obj[key].arr[i].equip_option[option];
                }
            }
    
            for (var grade of Object.keys(obj[key].grade)) {
                for (var option of Object.keys(obj[key].grade[grade])) {
                    if (gradeObj[option]) gradeObj[option] += obj[key].grade[grade][option];
                    else gradeObj[option] = obj[key].grade[grade][option];

                    if (totalObj[option]) totalObj[option] += obj[key].grade[grade][option];
                    else totalObj[option] = obj[key].grade[grade][option];
                }
            }
    
            for (var unit of Object.keys(obj[key].unit)) {
                for (var option of Object.keys(obj[key].unit[unit])) {
                    if (influenceObj[option]) influenceObj[option] += obj[key].unit[unit][option];
                    else influenceObj[option] = obj[key].unit[unit][option];

                    if (totalObj[option]) totalObj[option] += obj[key].unit[unit][option];
                    else totalObj[option] = obj[key].unit[unit][option];
                }
            }
    
            var gradeBadge = '';
            for (var k of Object.keys(obj[key].count.grade)) {
                if (obj[key].count.grade[k] > 1) {
                    var colorSet = getGradeColor(k);
                    gradeBadge += '<span class="badge me-1" style="background-color: ' + colorSet.background + '; color: ' + colorSet.font + ';">' + k +' X ' + obj[key].count.grade[k] + '</span>';
                }
            }
            if (gradeBadge != '') gTable += '<tr><td colspan="2">' + gradeBadge + '</td></tr>';
            for (var k of Object.keys(gradeObj)) {
                gTable += '<tr class="tr-left"><th class="' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active">' : '">') + k + '</th><td class="text-align-right' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active' : '') + '">' + addComma(gradeObj[k]) + '</td></tr>';
            }

            var unitBadge = '';
            for (var k of Object.keys(obj[key].count.unit)) {
                if (obj[key].count.unit[k] > 1) {
                    var colorSet = getUniteColor(k);
                    unitBadge += '<span class="badge me-1" style="background-color: ' + colorSet.background + '; color: ' + colorSet.font + ';">' + k +' X ' + obj[key].count.unit[k] + '</span>';
                }
            }
            if (unitBadge != '') iTable += '<tr><td colspan="2">' + unitBadge + '</td></tr>';
    
            for (var k of Object.keys(influenceObj)) {
                iTable += '<tr class="tr-left"><th class="' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active">' : '">') + k + '</th><td class="text-align-right' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active' : '') + '">' + addComma(influenceObj[k]) + '</td></tr>';
            }
    
            for (var k of Object.keys(equipObj)) {
                if (equipObj[k] > 0) {
                    eTable += '<tr class="tr-left"><th class="' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active">' : '">') + k + '</th><td class="text-align-right'  + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active' : '') +  '">' + addComma(equipObj[k]) + '</td></tr>';
                }
            }

            var importantValue = 0;
            for (var k of Object.keys(totalObj)) {
                if (totalObj[k] > 0) {
                    tTable += '<tr class="tr-left"><th class="' + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active">' : '">') + k + '</th><td class="text-align-right'  + (['피해저항', '피해저항관통'].indexOf(k) > -1 ? ' table-active' : '') +  '">' + addComma(totalObj[k]) + '</td></tr>';
                }

                if (k == '피해저항' || k == '피해저항관통') importantValue += totalObj[k];
            }

            mobTable += '</div>';
            mobTable += '<div class="mt-3 mb-3"><div class="btn-group" role="group"><button type="button" class="btn btn-outline-primary active btn-simple">간단히 보기</button><button type="button" class="btn btn-outline-primary btn-detail">자세히 보기</button></div><button type="button" class="btn btn-outline-danger ms-3" disabled><i class="bx bxs-meteor"></i>' + addComma(importantValue) + '</button></div>';
            gTable += '</tbody></table></div>';
            iTable += '</tbody></table></div>';
            eTable += '</tbody></table></div>';
            tTable += '</tbody></table></div>';

            result[key] = mobTable;
            result[key] += '<div class="row result-simple-tables">' + tTable + '</div>';
            result[key] += '<div class="row result-detail-tables" style="display: none;">' + gTable + iTable + eTable + '</div>';
        }
    }
    return result;
}

function getUniteColor(unite) {
    var result = {'background': '', 'font': ''};
    if (unite == '결의') {
        result['background'] ='#22741C';
        result['font'] = '#F0F0F0';
    } else if (unite == '고요') {
        result['background'] ='#49A2FF';
        result['font'] = '#F0F0F0';
    } else if (unite == '의지') {
        result['background'] ='#CFABA5';
        result['font'] = '#000';
    } else if (unite == '침착') {
        result['background'] ='#7AF1FF';
        result['font'] = '#000';
    } else if (unite == '냉정') {
        result['background'] ='#F0F0F0';
        result['font'] = '#000';
    } else if (unite == '활력') {
        result['background'] ='#ACE929';
        result['font'] = '#000';
    }
    return result;
}

function getGradeColor(grade) {
    var result = {'background': '', 'font': ''};
    switch (grade + '') {
    case '보물':
        result['background'] ='#8041D9';
        result['font'] = '#F0F0F0';
        break;
    case '전설':
        result['background'] ='#DE4F4F';
        result['font'] = '#F0F0F0';
        break;
    }
    return result;
}

function getUniteBorder(unite) {
    switch (unite) {
        case '결의':
            return 'inf-border-green';
        case '고요':
            return 'inf-border-blue';
        case '의지':
            return 'inf-border-pink';
        case '침착':
            return 'inf-border-sky';
        case '냉정':
            return 'inf-border-white';
        case '활력':
            return 'inf-border-mint';
        default:
            return 'inf-border-green';
    }
}

function getInfluenceImg(influence) {
    switch (influence) {
        case '결의':
            return '001';
        case '고요':
            return '002';
        case '의지':
            return '004';
        case '침착':
            return '005';
        case '냉정':
            return '003';
        case '활력':
            return '006';
        default:
            return '001';
    }
}