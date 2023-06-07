<template>
  <div>
    <el-dialog
      width="950px"
      v-loading="loading"
      :visible="dialogVisible"
      @close="closeDialog"
      title="选择应用"
    >
      <div class="wrapper">
        <div class="left">
          <div class="note">
            <div>请选择应用</div>
            <span class="note2">
              列表中展示已上架的业主端APP应用
            </span>
          </div>
          <div class="searchForm">
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  prefix-icon="el-icon-search"
                  style="width: 200px"
                  v-model="searchParam"
                  placeholder="请输入APP应用名称"
                />
              </el-form-item>
              <el-form-item label="上架区域:">
                <region ref="region" @regionId="handleRegionId" />
              </el-form-item>
              <el-form-item>
                <el-button
                  size="small"
                  type="primary"
                  @click="getServiceList()"
                >
                  查询
                </el-button>
                <el-button size="small" @click="handleReset()">
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="tableData"
            ref="multipleTable"
            @select="currentChange"
            @select-all="currentAll"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="appName"
              label="APP应用名称"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="detail"
              show-overflow-tooltip
              label="应用描述"
              align="center"
            />
            <el-table-column
              prop="areaNames"
              show-overflow-tooltip
              label="应用范围"
              align="center"
            />
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          />
        </div>
        <div class="right">
          <div>已选择应用</div>
          <div style="max-height:680px;overflow-y:auto">
          <el-tag
            v-for="(item, index) in selectedList"
            style="margin:5px"
            closable
            :key="item.uuid"
            @close="closeTag(index, item)"
          >
            {{ formatName(item.appName) }}
          </el-tag>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uniqBy } from 'lodash';
import { getServiceList } from '../server.js';
import region from './regionComponent.vue';
export default {
  components: {
    region
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    selectedServiceList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      area: [],
      areaUuid: '',
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      searchParam: '',
      serviceList: [],
      selectedList: [],
      areaId: [],
      regionList: []
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getServiceList();
        this.initSelection();
      }
    }
  },
  methods: {
    handleRegionId(val) {
      this.areaUuid = val;
    },
    formatName(val) {
      if (val && val.length > 20) {
        return val.substring(0, 19) + '...';
      } else {
        return val;
      }
    },
    initSelection() {
      this.selectedList = [];
      if (this.selectedServiceList && this.selectedServiceList.length > 0) {
        this.selectedServiceList.forEach(item => {
          this.selectedList.push(item);
        });
        this.toggleRowSelection(this.selectedList);
      }
    },
    closeDialog() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.area = [];
      this.areaUuid = '';
      this.$refs.region.reset();
      this.searchParam = '';
      this.$emit('closeDialog');
    },
    handleSave() {
      this.$emit('handleSelectService', this.selectedList);
      this.$emit('closeDialog');
    },
    // 右侧点击关闭 取消关联
    closeTag(index, val) {
      this.selectedList.splice(index, 1);
      this.toggleRowSelection(this.selectedList);
    },
    // 切换选中状态
    toggleRowSelection(rows) {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        if (!rows || rows.length === 0) {
          return;
        }
        rows.forEach(row => {
          const index = this.getIndex(row.uuid);
          if (index === -1) {
            return;
          }
          this.$refs.multipleTable.toggleRowSelection(
            this.tableData[index],
            true
          );
        });
      });
    },
    // 获取已关联的tableData中的下标
    getIndex(selectId) {
      let index = -1;
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (item.uuid === selectId) {
          index = i;
          continue;
        }
      }
      return index;
    },
    // 切换 pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.getServiceList();
    },
    // 切换 pageNum
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getServiceList();
    },
    async getServiceList() {
      let params = {
        areaUuid: this.areaUuid,
        isPublish: 1,
        usagePlatform: 3,
        appName: this.searchParam,
        pageSize: this.pageSize,
        pageNo: this.pageNum
      };
      this.loading = true;
      try {
        const res = await getServiceList(params);
        this.loading = false;
        if (res.recode === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.toggleRowSelection(this.selectedList);
        }
      } catch (e) {
        this.loading = false;
      }
    },
    currentChange(val, it) {
      // 勾选
      if (val.some(item => item.uuid === it.uuid)) {
        this.handleSelectAllChange(it, true);
      } else {
        // 取消勾选
        this.handleSelectAllChange(it, false);
      }
    },
    currentAll(selection) {
      if (selection.length > 0) {
        this.handleSelectAllChange(selection, true);
      } else {
        this.handleSelectAllChange(this.tableData, false);
      }
    },
    handleSelectAllChange(list, isAdd) {
      if (list instanceof Array) {
        if (isAdd) {
          let arr = this.selectedList.concat(list);
          this.selectedList = uniqBy(arr, 'uuid');
        } else {
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < this.selectedList.length; j++) {
              if (list[i].uuid === this.selectedList[j].uuid) {
                this.selectedList.splice(j, 1);
                break;
              }
            }
          }
        }
      } else {
        if (!isAdd && this.selectedList.some(item => item.uuid === list.uuid)) {
          this.selectedList = this.selectedList.filter(
            item => item.uuid !== list.uuid
          );
        } else if (isAdd && (this.selectedList.length === 0 || this.selectedList.some(item => item.uuid !== list.uuid))) {
          this.selectedList.push(list);
        }
      }
    },
    handleReset() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.searchParam = '';
      this.areaUuid = '';
      this.area = [];
      this.$refs.region.reset();
      this.getServiceList();
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  max-height: 710px;
  overflow-y: auto;
}
.left {
  width: 70%;
}
.right {
  display: block;
  width: 30%;
}
.note {
  display: flex;
}
.note2 {
  margin-left: 20px;
  color: lightskyblue;
}
</style>
