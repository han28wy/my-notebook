## 工具函数整理

### 时间日期选择器el-date-picker 不能选择之前日期，不能选择当前时间以前（时+分）
 ```
 <el-form-item
          requried
          label="定时推送时间:">
          <el-date-picker
            size="small"
            :picker-options="pickerOptionsStart"
            @change="publishTimeChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="publishTime"
            type="datetime"
            placeholder="选择日期时间"/>
 </el-form-item>
 data(){
    return {
     pickerOptionsStart: {
        disabledDate(date) {
          let ninetyDays = new Date(moment().valueOf() + 90 * 24 * 60 * 60 * 1000);
          return date > ninetyDays || date.getTime() < Date.now() - 8.64e7;
        },
        selectableRange: '00:00:00 - 23:59:59'
      },
    }
 }
   watch: {
    publishTime(val) {
        // 如果是当天 不能选择以前的时间
      if (moment(val).isSame(moment(), 'day')) {
        this.setStartTime();
      } else {
        this.pickerOptionsStart.selectableRange = '00:00:00 - 23:59:59';
      }
    }
  },
```

### 获取两个日期间隔内，是否包含目标星期
```
     containsTargetWeek(startTime, endTime, target) {
        let res = false;
        // 获取间隔多少天
        let day1 = Date.parse(startTime);
        let day2 = Date.parse(endTime);
        let diff = Math.abs(day2 - day1);
        let totalDays = 1 + Math.floor(diff / (1000 * 3600 * 24));
        // 如果间隔时间小于7天，再检查周几是否在时间间隔内
        if (totalDays < 8) {
        target = target === '7' ? '0' : target;
          for (let i = 0; i < totalDays; i++) {
            let curr = moment(day1).add(i, 'day').day();
            if (target === curr.toString()) {
              // 包含目标周
              res = true;
            }
          }
        } else {
          res = true
        }
    }
```