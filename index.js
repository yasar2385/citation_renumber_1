// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;
const CONFIG = {
  'data-name': 'fig',
  sentence: 'Figure',
  'ref-type': 'fig',
  findCaption: '.caption',
  findCaptionInner: '.caption .p',
  'new-item-key': 'data-figure',
  dircite: {
    single_prefix: 'Figure ',
    double_prefix: 'Figure ',
    double_sep: ' and ',
    multi_prefix: 'Figures ',
    range_sep: '–',
    openwrap: '',
    closewrap: '',
  },
  indircite: {
    single_prefix: 'Figure ',
    double_prefix: 'Figure ',
    double_sep: ' and ',
    multi_prefix: 'Figures ',
    range_sep: '–',
    openwrap: '(',
    closewrap: ')',
  },
  caption: {
    lable: 'yes',
    end_delim: '.',
    limit: '3',
  },
  label: {
    Patteren: 'Figure #.',
    Addbefore: '',
    Addafter: '.',
  },
};
// let oldValue = 'Figure 1.',
//   newValue = ' Figure 2.';

// [oldValue, newValue].forEach((data, idx, arr) => {
//   console.log([idx == 0 ? oldValue : newValue][0]);
//   [idx == 0 ? oldValue : newValue][0] = data.endsWith('.')
//     ? data.slice(0, -1)
//     : data;
// });
// console.log([oldValue, newValue]);
// let oldValue_1 = 'Figure 1A', newValue_2 = 'Figure 2';
// console.log(!'A'.match(/\d+/g));
// let p = document.createElement('p');
// p.textContent = Text_Compare_Update(oldValue_1, newValue_2, {
//   delVal: !0,
//   addPartLab: !0,
// }).newVal;
// appDiv.appendChild(p);

// console.log(![''][0].match(/[A-z]/));
function rangeExtraction(list, config) {
  try {
    var len = list.length;
    var out = [];
    var i, j;
    var default_sep = {
      double_sep: ',',
      range_sep: '–',
    };
    config = CONFIG;
    for (i = 0; i < len; i = j + 1) {
      // beginning of range or single
      out.push(list[i]);
      // find end of range
      for (var j = i + 1; j < len && list[j] == list[j - 1] + 1; j++);
      j--;
      if (i == j) {
        // single number
        out.push(config.double_sep);
      } else if (i + 1 == j) {
        // two numbers
        out.push(config.double_sep, list[j], config.double_sep);
      } else {
        // range
        out.push(config.range_sep, list[j], config.double_sep);
      }
    }
    out.pop(); // remove trailing comma
    return out.join('');
  } catch (err) {
    console.warn(err.messgae);
  }
}
var GET_SET_PART = function (string, Option) {
  try {
    return string.match(/[A-z]/) ? string.match(/[A-z]/).join('') : '';
  } catch (err) {
    console.warn(err.message);
    ErrorLogTrace('GET_PART', err.message);
  }
};
var Get_Set_Part_Label = function (old_label, Option) {
  try {
    Option = Option ? Option : { set: !1 };
    let IsJoin_old_Cite = old_label[1] ? !1 : !0;
    let lab = '';
    if (typeof old_label !== 'string') {
      lab = old_label[old_label[1] ? 1 : 0];
    }
    let Obj = { single: {}, range: {} };
    console.log('lab.indexOf')
    if (lab.indexOf('–') > 0) {
      Obj.range_label_1 = GET_SET_PART();
      Obj.range_label_2 = GET_SET_PART();
      if (Option.set) {
        if (Option.newValue.indexOf('–') > 0) {
          // ? Figures 1-3
          Obj.newValue = Option.newValue
            .split('–')
            .map((s, idx) => s + Obj[idx == 0 ? range_label_1 : range_label_2])
            .join('–');
        } else if (Option.newValue.indexOf(',') > 0) {
          // ? Figures 1,3,4
          Obj.newValue =
            (IsJoin_old_Cite ? '' : old_label[0]) +
            Option.newValue
              .split(',')
              .map(
                (s, idx, arr) =>
                  s +
                  Obj[
                    idx == 0
                      ? range_label_1
                      : idx === arr.length - 1
                      ? range_label_2
                      : ''
                  ]
              )
              .join(',');
        }
      }
    } else {
      Obj.single.label_1 = GET_SET_PART(lab);
      console.log('Obj.single');
      console.log(old_label);
      if (Option.set) {
        Obj.newValue =
          (IsJoin_old_Cite ? '' : old_label[0]) + Obj.single.label_1;
      }
    }
    console.log('Objsingle');
    console.log(Obj);
    return Obj;
  } catch (err) {
    console.warn(err.message);
    //ErrorLogTrace('Get_Set_Part_Label', err.message);
  }
};
var UpdateTrack = function (node, oldValue, newValue, Options) {
  var InsertDOM = document.createElement('insert');
  var elmParent = node.parentElement;
  // ? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
  oldValue = oldValue.endsWith('.') ? oldValue.slice(0, -1) : oldValue;
  newValue = newValue.endsWith('.') ? newValue.slice(0, -1) : newValue;
  if (!['INSERT', 'DEL'].includes(elmParent.tagName)) {
    var Insert = node.querySelector('insert');
    if (Insert) {
      // ? Edited Citation here
      if (Insert.hasAttribute('data-del-val')) {
        let oldVal = Insert.getAttribute('data-del-val');
        let IsPartLabel = oldVal.match(/[A-z]/)
          ? oldVal.match(/[A-z]/).join('')
          : '';
        if (oldVal == newValue.split(' ')[1] + IsPartLabel) {
          node.innerHTML = newValue + IsPartLabel;
        } else {
          // ? Handle Here Again
          Insert.textContent = newValue + IsPartLabel;
        }
      } else {
        // ? Newly Inserted Citation
        newValue = Text_Compare_Update(Insert.textContent, newValue, {
          addPartLab: !0,
          node: node,
        }).newVal;
        Insert.textContent = newValue;
      }
      Insert.setAttribute('data-last-change-time', new Date().getTime());
    } else {
      // ? Un edited Citation
      let GetObj = Text_Compare_Update(node.textContent, newValue, {
        delVal: !0,
        addPartLab: !0,
        node: node,
      });
      console.log(`Text_Compare_Update`);
      console.log(GetObj);
      InsertDOM.setAttribute('data-del-val', GetObj.delVal);
      InsertDOM.textContent = GetObj.newVal;
      node.innerHTML = InsertDOM.outerHTML;
    }
  } else if (['INSERT'].includes(elmParent.tagName)) {
    // ? Edited Citation here
    if (elmParent.hasAttribute('data-del-val')) {
      let oldVal = elmParent.getAttribute('data-del-val');
      node.textContent = oldVal == newValue.split(' ')[1] ? oldVal : newValue;
    } else {
      // ? Newly Inserted Citation
      node.textContent = newValue;
    }
  }
};
var Text_Compare_Update = function (oldValue, newValue, Option) {
  try {
    Option = Option ? Option : { delVal: !1 };
    let split = { new: newValue.split(' '), old: oldValue.split(' ') };
    let IsJoin_old_Cite = split.old[1] ? !1 : !0;
    let new_rid = Option.node.getAttribute('rid');
    let new_full_digit = rangeExtraction(
      new_rid.split(' ').map((string) => parseInt(string.replace(/\D/g, '')))
    );
    if (
      split.old[0] == split.new[0] ||
      split.old[0].match(split.new[0]) ||
      split.new[0].match(split.old[0] || IsJoin_old_Cite)
    ) {
      let ReTurn_Obj = {};
      if (Option.addPartLab) {
        let PART_LAB = Get_Set_Part_Label(split['old'], {
          set: !0,
          newValue: new_full_digit,
        });
        ReTurn_Obj.newVal = PART_LAB.newValue;
      }
      if (Option.delVal) {
        ReTurn_Obj.delVal = split.old[IsJoin_old_Cite ? 0 : 1];
      }
      console.log('ReTurn_Obj');
      console.log(ReTurn_Obj);
      return ReTurn_Obj;
    }
  } catch (err) {
    console.warn(err.message);
  }
};
var IS_JOURNAL = !0;
var check = function () {
  console.log('Start');
  var ArrLab = [
    {
      Original_lab: 'Figure 1',
      Original_Id: 'F1',
      Seq_No: '1',
      NewLabel: 'Figure 2',
      NewId: 'F2',
    },
  ];
  console.log('Start Array');
  Array.from(ArrLab).forEach((item, ind, arr) => {
    if (item.NewLabel.length != 0) {
      console.log(item.Original_Id);
      document
        .querySelectorAll(`a[rid*=${item.Original_Id}]:not([data-cite])`)
        .forEach((elm, i, ar) => {
          // ? Handle new and existing citation here
          if (elm.textContent.length < 2 && !elm.textContent.match(/\d+/g))
            return;
          if (IS_JOURNAL) {
            let rid = elm.getAttribute('rid');
            if (!elm.hasAttribute('orid')) elm.setAttribute('orid', rid);
            if (rid == item.Original_Id) {
              console.log('singlle');
              elm.setAttribute('rid', item.NewId);
            } else {
              console.log('multiple');
              // ? multiple rid
              //rid.replace(item.Original_Id, item.NewId);
              var new_rid_arr = [];
              rid.split(' ').forEach((RID) => {
                Object.keys(ArrLab).filter(function (key) {
                  if (ArrLab[key]['Original_Id'] === RID) {
                    let IsSame = ArrLab[key]['NewId'] == '';
                    new_rid_arr.push(
                      ArrLab[key][IsSame ? 'Original_Id' : 'NewId']
                    );
                  }
                });
              });
              let new_rid = new_rid_arr.join(' ');
              elm.setAttribute('rid', new_rid);
              elm.setAttribute('href', '#' + new_rid);
            }
          }
          elm.setAttribute('data-cite', 'edit');
          console.log('Updat Start');
          UpdateTrack(elm, item.Original_lab, item.NewLabel);
          console.log(item);
        });
    }
  });
};
check();
