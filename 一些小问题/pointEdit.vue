<template>
  <div class="wrapper">
    <div class="formBox">
      <div class="topBlock">
        <div class="tag">
          <el-tag style="height:auto;">
            *用户
            <br >
            *有效期：31天
          </el-tag>
        </div>
        <el-form
          ref="config"
          style="margin:0 auto"
          disabledref="config"
          :model="config"
          :rules="ruleValidate"
          label-width="180px"
        >
          <el-form-item prop="areaLevel" label="范围类型">
            <el-select
              v-model="config.areaLevel"
              @change="handleChangeSelection"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 选择省级 发布范围 -->
          <el-form-item
            prop="selectProvince"
            v-if="config.areaLevel === 1"
            :required="config.areaLevel === 1"
            label="适用范围"
          >
            <el-select v-model="config.selectProvince" multiple>
              <el-option
                v-for="item in provinceList"
                :key="item.uuid"
                :label="item.areaName"
                :value="item.uuid"
              />
            </el-select>
          </el-form-item>
          <!-- 选择市级 发布范围 -->
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
          <el-form-item
            prop="integralName"
            maxlength="20"
            show-word-limit
            label="名称"
          >
            <el-input
              v-model="config.integralName"
              style="width:220px"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item prop="type" label="类型">
            <el-radio v-model="config.type" label="1">活跃</el-radio>
          </el-form-item>
          <el-form-item prop="giveType" label="赠送方式">
            <el-radio v-model="config.giveType" label="1">固定</el-radio>
          </el-form-item>
          <el-form-item prop="getType" label="获取方式">
            <div>
              <el-checkbox v-model="config.isTypeLogin">登录APP</el-checkbox>
            </div>
            <div>
              <div class="selectGroup">
                <el-checkbox-group
                  v-model="serviceCheckbox"
                  @change="checkboxOne"
                >
                  <el-checkbox
                    v-for="item in checkboxList"
                    :key="item.value"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
                <el-button
                  v-if="serviceCheckbox[0] === '2'"
                  type="primary"
                  style="margin-left:20px"
                  @click="selectService()"
                >
                  选择
                </el-button>
              </div>
            </div>
          </el-form-item>
          <!-- 赠送 登录 -->
          <el-form-item
            prop="loginPoint"
            v-if="config.isTypeLogin"
            :rules= "ruleValidate.loginPoint"
            label="登录app"
          >
            <el-input
              class="input1"
              v-model="config.loginPoint"
              placeholder="请填写赠送"
            />
            {{ config.isTypeLogin ? '' : '' }}
          </el-form-item>
          <!-- 赠送 所有app -->
          <el-form-item
            prop="allServicePoint"
            v-if="serviceCheckbox[0] === '1'"
            :rules="ruleValidate.allServicePoint"
            label="使用全部应用"
          >
            <el-input
              class="input1"
              v-model="config.allServicePoint"
              placeholder="请填写赠送"
            />
            {{ serviceCheckbox[0] === '1' ? '' : '' }}
          </el-form-item>
          <!-- 赠送 部分app -->
          <el-form-item
            prop="someServicePoint"
            v-if="serviceCheckbox[0] === '2'"
            :rules="ruleValidate.someServicePoint"
            label="使用部分应用"
          >
            <div style="margin-bottom:40px">
              <div
                class="item_style"
                v-for="(item, index) in someService"
                :key="index"
              >
                <div style="width:100px">{{ item.appName }}</div>
                <div>
                  <el-input
                    class="input2"
                    v-model="item.integralValue"
                    placeholder="请输入"
                  />
                  
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="btnGroup">
        <el-button type="primary" @click="handleSave()">
          保存
        </el-button>
        <el-button @click="handleCancel()">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from '../server.js';
export default {
  components: {
  },
  props: {},
  data() {
    const validateProvince = (rule, value, callback) => {
      if (this.config.areaLevel === 1) {
        if (this.config.selectProvince.length > 0) {
          callback();
        } else {
          callback(new Error('请选择发布范围'));
        }
      } else {
        callback();
      }
    };
    const validateCity = (rule, value, callback) => {
      if (this.config.areaLevel === 2 && this.selectTree.length === 0) {
        callback(new Error('请选择发布范围'));
      } else {
        callback();
      }
    };
    const validateGetType = (rule, value, callback) => {
      if (!this.config.isTypeLogin && !this.serviceCheckbox[0]) {
        callback(new Error('请选择获取方式'));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      let reg = /^[0-9]\d*$/;
      console.log(value, '   ', reg.test(value), '    ', value < 1, '    ', value > 999);
      if (!value || !reg.test(value) || value < 1 || value > 999) {
        callback(new Error('请填写1-999的整数'));
      } else {
        callback();
      }
    };
    const validatePoint = (rule, value, callback) => {
      if (!this.someService || this.someService.length === 0) {
        callback(new Error('请选择应用'));
      }
      let reg = /^[0-9]\d*$/;
      let valid = true;
      this.someService.forEach(item => {
        if (!item.integralValue || !reg.test(item.integralValue) || item.integralValue < 1 || item.integralValue > 999) {
          valid = false;
        }
      });
      if (valid) {
        callback();
      } else {
        callback(new Error('请填写1-999的整数'));
      }
    };
    return {
      checkboxList: [
        {
          value: '1',
          label: '选择全部应用'
        },
        {
          value: '2',
          label: '选择部分应用'
        }
      ],
      integralUuid: '',
      serviceCheckbox: [],
      selectedProvinceNames: [],
      selectTree: [],
      provinceList: [],
      area: [],
      defaultCheckNames: [],
      someService: [],
      radio: '1',
      checked: false,
      visible: false,
      config: {
        selectProvince: [],
        integralName: '',
        areaLevel: '',
        areaName: '',
        areaUuid: [],
        isTypeLogin: null,
        loginPoint: '',
        obtainByService: '',
        selectedAreaName: [],
        allServicePoint: '',
        giveType: '1',
        type: '1'
      },
      options: [
        {
          value: 0,
          label: '全国'
        },
        {
          value: 1,
          label: '省级'
        },
        {
          value: 2,
          label: '市级'
        }
      ],
      searchForm: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'areaName',
        isLeaf: 'leaf'
      },
      ruleValidate: {
        areaLevel: [
          {
            required: true,
            message: '请选择范围类型',
            trigger: 'blur'
          }
        ],
        integralName: {
          required: true,
          message: '请填写名称',
          trigger: 'blur'
        },
        type: {
          required: true
        },
        giveType: {
          required: true
        },
        selectProvince: {
          trigger: 'blur',
          validator: validateProvince
        },
        selectedAreaName: {
          trigger: 'blur',
          validator: validateCity
        },
        getType: {
          required: true,
          trigger: 'blur',
          validator: validateGetType
        },
        loginPoint: {
          required: true,
          message: '请填写1-999的整数',
          validator: validateNumber
        },
        allServicePoint: {
          required: true,
          trigger: 'blur',
          validator: validateNumber
        },
        someServicePoint: {
          required: true,
          trigger: 'blur',
          validator: validatePoint
        }
      }
    };
  },
  async created() {
    await this.initTree();
    await this.fetchData();
  },
  methods: {
    getAreaNamesAndUuids() {
      this.axios
        .get(
          '/integralMarket/integralConfig/' +
            this.integralUuid +
            '/getAreaUuidAndNamesList'
        )
        .then(res => {
          if (res.recode === 200) {
            return res.data;
          }
        });
    },
    // checkbox-group单选
    checkboxOne() {
      if (this.serviceCheckbox.length > 1) {
        this.serviceCheckbox.splice(0, 1);
      }
    },
    initTree() {
      const params = {
        uuid: 1,
        level: 0,
        limit: 1
      };
      this.axios
        .get(this.apiNames.apiPositionList, { params: params })
        .then(res => {
          let myList = [];
          res.data.forEach(e => {
            e.disabled = true;
            myList.push(e);
          });
          this.treeData = myList;
          this.provinceList = myList;
        })
        .catch(() => {
          this.treeData = [];
        });
    },
    setCheckedNodes() {
      if (this.selectTree) {
        this.$nextTick(() => {
          this.selectTree.forEach(item => {
            this.$refs.tree.setChecked(item.id, true);
          });
        });
      }
    },
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
    getOrgList(node, resolve) {
      let params = {};
      if (node.level === 1) {
        params = {
          uuid: node.data.uuid,
          level: node.data.level,
          limit: 1
        };
        this.axios
          .get(this.apiNames.apiPositionList, { params: params })
          .then(res => {
            let myList = [];
            res.data.forEach(e => {
              e.leaf = true;
              myList.push(e);
            });
            this.setCheckedNodes();
            resolve(myList);
          })
          .catch(() => {
            resolve([]);
          });
      }
    },
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
    selectService() {
      this.visible = true;
    },
    // 切换范围类型
    async handleChangeSelection() {
      this.config.selectedAreaName = [];
      this.config.selectProvince = [];
      if (this.config.areaLevel === 2) {
        this.initTree();
      }
    },
    handleSelectService(val) {
      console.log('弹窗确定回调！！！', val);
      this.someService = [];
      val.forEach(item => {
        this.someService.push({
          appName: item.appName,
          integralValue: item.integralValue || '',
          serviceCode: item.serviceCode,
          uuid: item.uuid
        });
      });
    },
    handleCloseDialog() {
      this.visible = false;
    },
    async fetchData() {
      const { data, recode } = await getConfig();
      if (recode === 200) {
        this.config.integralName = data.integralName;
        this.config.areaLevel = data.areaLevel;
        this.integralUuid = data.integralUuid;
        this.handlePointList(data.integralRuleVOList);
        this.handleArea(data);
      }
    },
    async handleArea(data) {
      if (data.areaLevel === 1) {
        let list = data.areaUuids.split(',');
        list.forEach(item => {
          this.config.selectProvince.push(Number(item));
        });
      } else if (data.areaLevel === 2) {
        // 获取areaNames 和 areaUuid
        this.axios
          .get(
            '/integralMarket/integralConfig/' +
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
    },
    // type 规则类型（1-登录，2-使用全部应用，3-使用部分应用）
    handlePointList(val) {
      this.someService = [];
      val.forEach(item => {
        if (item.type === 1) {
          this.config.isTypeLogin = true;
          this.config.loginPoint = item.integralValue;
        }
        if (item.type === 2) {
          this.serviceCheckbox = ['1'];
          this.config.allServicePoint = item.integralValue;
        }
        if (item.type === 3) {
          this.serviceCheckbox = ['2'];
          item.uuid = item.resourceUuid;
          this.someService.push(item);
        }
      });
    },
    requireProvince() {
      if (this.serviceCheckbox[0] === '1') {
        return true;
      } else {
        return false;
      }
    },
    requireCity() {
      if (this.serviceCheckbox[0] === '2') {
        return true;
      } else {
        return false;
      }
    },
    handleEdit() {
      let params = {
        areaLevel: this.config.areaLevel,
        areaUuids: this.getAreaUuids(),
        areaNames: this.getAreaNames(),
        giftType: 1,
        integralName: this.config.integralName,
        integralType: 1,
        accessType: this.getAccessType(),
        integralRuleVOList: this.getIntegralRuleVOList(),
        unformat: 1
      };
      this.axios
        .post('/integralMarket/integralConfig/save', params)
        .then(res => {
          if (res.recode === 200) {
            this.$Message.success('操作成功');
            this.$router.push('showPointConfig');
          }
        });
    },
    handleSave() {
      this.$refs.config.validate(valid => {
        if (valid) {
          this.handleEdit();
        } else {
          console.log('校验没通过');
        }
      });
    },
    getAreaNames() {
      if (this.config.areaLevel === 0) {
        return '全国';
      } else if (this.config.areaLevel === 1) {
        let resMap = new Map();
        let names = [];
        // 省份列表转为map格式
        this.provinceList.forEach(item => {
          resMap.set(item.uuid, item);
        });
        this.config.selectProvince.forEach(item => {
          names.push(resMap.get(item).areaName);
        });
        return names.join(',');
      } else if (this.config.areaLevel === 2) {
        return this.config.selectedAreaName.join(',');
      }
    },
    getAreaUuids() {
      let res = [];
      if (this.config.areaLevel === 0) {
        res = [1];
      } else if (this.config.areaLevel === 1) {
        res = [this.config.selectProvince];
      } else if (this.config.areaLevel === 2) {
        this.selectTree.forEach(item => {
          res.push(item.id);
        });
      }
      return res.length === 0 ? '' : res.join(',');
    },
    getAccessType() {
      let res = [];
      if (this.config.isTypeLogin) {
        res.push(0);
      }
      if (this.serviceCheckbox[0] === '1') {
        res.push(1);
      }
      if (this.serviceCheckbox[0] === '2') {
        res.push(2);
      }
      return res.join(',');
    },
    getIntegralRuleVOList() {
      let result = [];
      if (this.config.isTypeLogin) {
        result.push({
          type: 1,
          serviceCode: '',
          appName: '',
          integralValue: this.config.loginPoint
        });
      }
      if (this.serviceCheckbox[0] === '1') {
        result.push({
          type: 2,
          serviceCode: '',
          appName: '',
          integralValue: this.config.allServicePoint
        });
      }
      if (this.serviceCheckbox[0] === '2') {
        this.someService.forEach(item => {
          result.push({
            type: 3,
            serviceCode: item.serviceCode,
            appName: item.appName,
            integralValue: item.integralValue
          });
        });
      }
      return result;
    },
    handleCancel() {
      this.$router.push('showPointConfig');
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  background: #fff;
  height: 940px;
}
.input1 {
  display: inline-block;
  width: 180px;
  margin-right: 10px;
}
.input2 {
  display: inline-block;
  width: 150px;
  margin-right: 10px;
}
.item_style {
  display: flex;
  margin-bottom: 10px;
}
.selectGroup {
  display: flex;
  align-items: center;
}
.formBox {
  width: calc(100% - 40px);
  padding: 20px;
  border-radius: 8px;
}
.topBlock {
  max-height: 800px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}
.btnGroup {
  position: absolute;
  bottom: 50px;
  left: 50%;
}
.tag {
  margin: 10px auto;
}
</style>
