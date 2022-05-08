function constructDeepCopy(value) {
  var objectConstructor = {}.constructor;
  if (value == null) return value;
  else if (value.constructor == objectConstructor) {
    var result = {};
    for (var key in value) {
      result[key] = constructDeepCopy(value[key]);
    }
    return result;
  } else if (Array.isArray(value)) {
    var result = [];
    for (var i = 0; i < value.length; i++) {
      result.push(constructDeepCopy(value[i]));
    }
    return result;
  } else return value;
}

// function to perform localisation for data returned from api
// e.g. {"name_en": "en", "name_cn": "cn"} => {"name": "xxx"}
const _mapLang = (data, lang) => {
  const x = (item) => {
    if (!item.name) {
      if (item.name_en && item.name_cn) {
        if (lang == "en") {
          item.name = item.name_en;
        } else if (lang == "chi") {
          item.name = item.name_cn;
        }
      } else {
        if (item.name_en) {
          item.name = item.name_en;
        } else if (item.name_cn) {
          item.name = itme.name_cn;
        }
      }
    }
    return item;
  };
  if (!Array.isArray(data)) {
    return x(data);
  } else {
    return data.map(x);
  }
};

const getPhysicalType = (code, lang) => {
  switch (code) {
    case 'U':
    case 'O':
      return lang === 'en' ? 'BNet Card' : 'BNet 卡';
    case 'V':
      return lang === 'en' ? 'VIP Gold Card' : 'VIP 金卡';
    case 'E':
      return lang === 'en' ? 'EOS Gold Card' : 'EOS金卡';
    default:
      return code;
  }
}

module.exports = {
  DeepCopy: constructDeepCopy,
  getPhysicalType
};
