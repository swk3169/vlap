import configs from './configs'

const utils = {}

utils.makeurls = (url) => {
  return configs.HOME + url;
}

utils.isEmpty = (value) => {
  return value === undefined || value === null || value === '';
}

utils.diffDays = (first, second) => {
  //console.log(first);
  return Math.round((second-first)/(1000*60*60*24));
}

utils.diffHours = (first, second) => {
  return Math.round((second-first)/(1000*60*60));
}

utils.extractTag = (str) => {
  //return str.split(' ').filter(v=> v.startsWith('#'))
  //return str.match(/#[\p{L}]+/ugi)
  // 참고: http://alik.info/p/139
  var tags = '';
  var tagCheck = {};
  str.replace(/#[^#\s,;]+/gm, function(tag) {
    tag = tag.split('#').join(''); // remove '#'
    tagCheck[tag] = true;
    //tags.push(tag);
  });

  for (var tag in tagCheck) {
    tags += tag + ',';
  }

  tags = tags.substr(0, tags.length - 1)
  return tags;
}

export default utils;