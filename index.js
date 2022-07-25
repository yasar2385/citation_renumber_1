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
    multi_sep: ',',
    range_sep: '–',
    openwrap: '',
    closewrap: '',
  },
  indircite: {
    single_prefix: 'Figure ',
    double_prefix: 'Figure ',
    double_sep: ' and ',
    multi_prefix: 'Figures ',
    multi_sep: ',',
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

function rangeExtraction(list, config) {
  try {
    var len = list.length;
    var out = [];
    var i, j;

    config = CONFIG.dircite;
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
        out.push(config.multi_sep, list[j], config.multi_sep);
      } else {
        // range
        console.log('-------range------------');
        out.push(config.range_sep, list[j], config.double_sep);
      }
    }
    out.pop(); // remove trailing comma
    return out.join('');
  } catch (err) {
    console.warn(err.messgae);
  }
}
var IS_JOURNAL = !0;
var check = function (ArrLab) {
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
              console.log('single');
              elm.setAttribute('rid', item.NewId);
            } else {
              console.log('multiple');
              // ? multiple rid
              //rid.replace(item.Original_Id, item.NewId);
              var new_rid_arr = [];
              console.log(rid);
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
              console.log('__new_rid__');
              console.log(new_rid);
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
      console.log(`Text_Compare_Update`);
      console.log(node.textContent);
      let GetObj = Text_Compare_Update(node.textContent, newValue, {
        delVal: !0,
        addPartLab: !0,
        node: node,
      });
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
    console.log('oldValue,newValue');
    console.log(oldValue, newValue);
    Option = Option ? Option : { delVal: !1 };
    let new_rid = Option.node.getAttribute('rid');
     console.log('new_rid---');
     console.log(new_rid);
     console.log('new_num');
    let new_num = new_rid
      .split(' ')
      .map((string) => parseInt(string.replace(/\D/g, '')));
    // console.log(new_num);
    console.log('rangeExtraction');
    console.log(new_num);
    let new_full_digit = rangeExtraction(new_num);
    console.log(new_full_digit);
    let split = {
      new: [oldValue.split(' ')[0], new_full_digit],
      old: oldValue.split(' '),
    };
    console.log('AFTER_SPLIT');
    console.log(split);
    let IsJoin_old_Cite = split.old[1] ? !1 : !0;
    if (
      split.old[0] == split.new[0] ||
      split.old[0].match(split.new[0]) ||
      split.new[0].match(split.old[0] || IsJoin_old_Cite)
    ) {
      let ReTurn_Obj = {};
      if (Option.addPartLab) {
        console.log('split---new');
        console.log(split['old']);
        let PART_LAB = Get_Set_Part_Label(split['old'], {
          set: !0,
          newValue: split.new,
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
var GET_SET_PART = function (string, Option) {
  try {
    console.log('GET_SET_PART');
    //console.log(string);
    return string.split(string.replace(/\D/g, '')).join('');
  } catch (err) {
    console.warn(err.message);
    ErrorLogTrace('GET_PART', err.message);
  }
};
var Get_Set_Part_Label = function (old_label, Option) {
  try {
    console.log('Get_Set_Part_Label');
    console.log(Option.newValue);
    Option = Option ? Option : { set: !1 };
    let IsJoin_old_Cite = old_label[1] ? !1 : !0;
    let lab = '';
    if (typeof old_label !== 'string') {
      lab = old_label[old_label[1] ? 1 : 0];
    }
    let Obj = { single: {}, range: {},range_label_0:''};
    //console.log('__lab__');
    // console.log(lab);
    if (lab.indexOf('–') > 0 && lab.split('–')[1].replace(/\D/g, '')) {
      //console.log('lab.indexOf');
      //console.log(lab.split('–')[1].replace(/\D/g, ''));
      let range_split = lab.split('–');
      Obj.range_label_1 = GET_SET_PART(range_split[0]);
      Obj.range_label_2 = GET_SET_PART(range_split[1]);      
      console.log('range_label_1 ==> ' + Obj.range_label_1);
      console.log('range_label_2 ==> ' + Obj.range_label_2);
      if (Option.set) {
        console.log(`===>` + Option.newValue.join(' '));
        let tempVal = '';
        if (Option.newValue[1].indexOf('–') > 0) {
          // ? Figures 1-3
          console.log('newValue.indexOf');
          tempVal = Option.newValue[1]
            .split('–')
            .map((s, idx) => s + Obj[`range_label_${idx == 0 ? '1' : '2'}`])
            .join('–');
          console.log(tempVal);
          // Obj.newValue = (IsJoin_old_Cite ? '' : old_label[0]).concat(
          //   ' ',
          //   tempVal
          // );
        } else if (Option.newValue[1].indexOf(',') > 0) {
          console.log('--indexOf(",")---');
          // ? Figures 1,3,4
          console.log([Obj.range_label_0]);
          tempVal = Option.newValue[1]
            .split(',')
            .map(
              (s, idx, arr) =>
                s +
                Obj[`range_label_${idx == 0 ? '1' : (idx === arr.length - 1?'2':'0')}`]
                // Obj[
                //   idx == 0
                //     ? range_label_1
                //     : idx === arr.length - 1
                //     ? range_label_2
                //     : ''
                // ]
            )
            .join(',');
          console.log(tempVal);
        }
        Obj.newValue = (IsJoin_old_Cite ? '' : old_label[0]).concat(
          ' ',
          tempVal
        );
      }
    } else {
      console.log('Obj.single');
      console.log(lab);
      Obj.single.label_1 = GET_SET_PART(lab);
      //console.log(Option.newValue);
      if (Option.set) {
        Obj.newValue =
          (IsJoin_old_Cite ? '' : old_label[0]).concat(
            ' ',
            Option.newValue[1]
          ) + Obj.single.label_1;
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
let Or_Order = [
  {
    Original_lab: 'Figure 1',
    Original_Id: 'F1',
    Seq_No: '1',
    NewLabel: 'Figure 2',
    NewId: 'F2',
  },
  {
    Original_lab: 'Figure 2',
    Original_Id: 'F2',
    Seq_No: '2',
    NewLabel: 'Figure 3',
    NewId: 'F3',
  },
  {
    Original_lab: 'Figure 3',
    Original_Id: 'F3',
    Seq_No: '3',
    NewLabel: 'Figure 4',
    NewId: 'F4',
  },
  {
    Original_lab: 'Figure 4',
    Original_Id: 'F4',
    Seq_No: '4',
    NewLabel: 'Figure 5',
    NewId: 'F5',
  },
  {
    Original_lab: 'Figure 5',
    Original_Id: 'F5',
    Seq_No: '5',
    NewLabel: 'Figure 6',
    NewId: 'F6',
  },
  {
    Original_lab: 'Table 1',
    Original_Id: 'T1',
    Seq_No: '1',
    NewLabel: 'Table 2',
    NewId: 'T2',
  },
];
let Or_Order1_1 = [
  {
    Original_lab: 'Figure 1',
    Original_Id: 'F1',
    Seq_No: '1',
    NewLabel: '',
    NewId: '',
  },
  {
    Original_lab: 'Figure 2',
    Original_Id: 'F2',
    Seq_No: '2',
    NewLabel: '',
    NewId: '',
  },
  {
    Original_lab: 'Figure 3',
    Original_Id: 'F3',
    Seq_No: '3',
    NewLabel: '',
    NewId: '',
  },
  {
    Original_lab: 'Figure 4',
    Original_Id: 'F4',
    Seq_No: '4',
    NewLabel: 'Figure 5',
    NewId: 'F5',
  },
  {
    Original_lab: 'Figure 5',
    Original_Id: 'F5',
    Seq_No: '5',
    NewLabel: 'Figure 6',
    NewId: 'F6',
  },
];
//check(Or_Order);
check(Or_Order1_1);
