#### el-tag内容换行
```
<el-tag style="height:auto;">
            *用户一天内登录多次或同一应用使用多次仅计算一次积分，不重复累计
            <br >
            *积分有效期
```

#### el-select结合el-tree实现回显，勾选，回显后删除tag联动
```
   <el-form-item
            v-show="config.areaLevel === 2"
            :required="config.areaLevel === 2"
            prop="selectedAreaName"
            label="适用范围"
          >
            <el-select
              v-model="config.selectedAreaName"
              clearable
              multiple
              placeholder="请选择"
              @remove-tag="romoveTreeNode"
              @clear="removeAllNode"
            >
              <el-option
                style="height:100%; overflow-y:hidden;bcakground:white"
                disbled
                :value="selectTree.id"
              >
                <el-tree
                  ref="tree"
                  lazy
                  :data="treeData"
                  :load="getOrgList"
                  :props="defaultProps"
                  node-key="uuid"
                  :check-strictly="true"
                  @check-change="treeCheck"
                  show-checkbox
                  highlight-current
                />
              </el-option>
            </el-select>
          </el-form-item>

1 初始化treeData initTree()
2 回显老数据
回显的数据类型[{id: item.uuid, label:item.areaName}];
if (data.areaLevel === 2) {
        // 获取areaNames 和 areaUuid
        this.axios
          .get(
            '/operation/integralMarket/integralConfig/' +
              this.integralUuid +
              '/getAreaUuidAndNamesList'
          )
          .then(res => {
            if (res.recode === 200) {
              this.selectTree = [];
              this.config.selectedAreaName = [];
              res.data.forEach(item => {
                this.selectTree.push({
                  id: item.areaUuid,
                  label: item.areaName
                });
                this.config.selectedAreaName.push(item.areaName);
              });
            }
          });
      }
3 回显删除tag和删除所有tag联动
    removeAllNode() {
      this.selectTree = [];
      this.defaultCheckNames = [];
    },
    // 回显的节点 多选框删除tag联动
    romoveTreeNode(tag) {
      let target = '';
      this.selectTree.forEach((item, index) => {
        if (item.label === tag) {
          console.log('匹配到了');
          target = item.id;
          this.selectTree.splice(index, 1);
        }
      });
      this.$nextTick(() => {
        this.$refs.tree.setChecked(target, false);
      });
    },
4 勾选树
    treeCheck(node, checked) {
      if (checked) {
        // 勾选
        this.selectTree.push({ id: node.uuid, label: node.areaName });
        this.config.selectedAreaName.push(node.areaName);
      } else {
        // 取消勾选
        this.config.selectedAreaName.map((item, index) => {
          if (item.uuid === node.uuid) {
            this.config.selectedAreaName.splice(index, 1);
          }
        });
        this.selectTree.map((item, index) => {
          if (item.uuid === node.uuid) {
            this.selectTree.splice(index, 1);
          }
        });
      }
    },
```

#### el-form-item动态require，英文问题显示修复
```
 <el-form-item prop="allServicePoint" :rules="ruleValidate.allServicePoint" label="使用全部应用">
            <el-input
              class="input1"
              v-model="config.allServicePoint"/>
          </el-form-item>

    allServicePoint: {
          required: true,
          trigger: 'blur',
          validator: validateNumber
        },
```