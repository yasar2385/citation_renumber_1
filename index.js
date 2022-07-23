// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

let oldValue = 'Figure 1.',
  newValue = ' Figure 2.';

[oldValue, newValue].forEach((data, idx, arr) => {
  console.log([idx == 0 ? oldValue : newValue][0]);
  [idx == 0 ? oldValue : newValue][0] = data.endsWith('.')
    ? data.slice(0, -1)
    : data;
});
console.log([oldValue, newValue]);

var Text_Compare_Update = function (oldValue, newValue, Option) {
  try {
    Option = Option ? Option : { delVal: !1 };
    console.log('s');
    let split = { new: newValue.split(' '), old: oldValue.split(' ') };
    console.log('ss');
    //console.log(split);
    if (
      split.old[0] == split.new[0] ||
      split.old[0].match(split.new[0]) ||
      split.new[0].match(split.old[0]) ||
      !split.old[1]
    ) {
      console.log('sss');
      let ReTurn_Obj = {};
      if (Option.addPartLab) {
        split.range = split.old[1] ? split.old[1].split('–') : [''];
        console.log(split.range);
        let MATCH_PART_LAB = split.range[0].match(/[A-z]/);
        console.log('1');
        if (split.old[1] && split.old[1].length > 1 && MATCH_PART_LAB) {
          console.log('2');
          newValue = newValue + MATCH_PART_LAB.join('');
          if (split.range[1]) {
            newValue = newValue.concat('–', split.range[1]);
            console.log(newValue);
          }
        } else if (!split.old[1]) {
          // this loop for and condition Figures 1 and 2
          console.log('second');
          newValue = split.new[1] + split.old[0].match(/[A-z]/).join('');
          console.log('new value==> ' + newValue);
        }
        ReTurn_Obj.newVal = newValue;
      }
      if (Option.delVal) {
        console.log('del_track===> ' + split.old);
        ReTurn_Obj.delVal = split.old[1] ? split.old[1] : split.old[0];
      }
      return ReTurn_Obj;
    }
  } catch (err) {
    console.warn(err.message);
    //ErrorLogTrace('TextCompare_Update', err.message);
  }
};

let oldValue_1 = 'Figure 1A',
  newValue_2 = 'Figure 2';
console.log(!'A'.match(/\d+/g));
let p = document.createElement('p');
p.textContent = Text_Compare_Update(oldValue_1, newValue_2, {
  delVal: !0,
  addPartLab: !0,
}).newVal;
appDiv.appendChild(p);

console.log(![''][0].match(/[A-z]/));
