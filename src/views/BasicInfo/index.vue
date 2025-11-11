<template>
  <div class="user-info-container">
    <div class="user-info-title">基本信息</div>
    <el-card class="user-info-card">
      <div class="user-info-dropdown">
        <div class="user-info-card">
          <div class="user-avatar">
            {{ userInitial }}
          </div>
          <div class="user-details">
            <div class="user-name-row">
              <span class="username">{{ userInfo.username }}</span>
            </div>
            <div class="user-actions">
              <!-- <div v-if="!isVerified" class="verify-action">完成实名认证 ></div> -->
              <div class="account-badges">
                <span class="badge main-account">{{
                  userInfo.accountType === "MASTER" ? "主账号" : "子账号"
                }}</span>
                <!-- <span class="badge enterprise-verify"> 企业认证 > </span> -->
              </div>
            </div>
            <div class="account-id">账号ID: {{ userOrg.userId }}</div>
            <div class="account-id">邮箱: {{ email }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getUserInfoApi } from "@/api/login";
const userStore = useUserStore();
// 用户信息
const userInfo = computed(() => userStore.userInfo);
const userOrg = computed(() => userStore.userOrg);
// const isVerified = ref(true);
const email = ref("");
// 用户首字母
const userInitial = computed(() => {
  const username = userInfo.value.username;
  return username.charAt(0).toUpperCase();
});
onMounted(() => {
  getUserInfoData();
});
const getUserInfoData = async () => {
  const res = await getUserInfoApi(userOrg.value.userId);
  email.value = res.data.email;
};
</script>

<style lang="less" scoped>
.user-info-container {
  .user-info-title {
    padding: 0 20px 20px 20px;
    border-bottom: solid 1px #e0e0e0;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .user-info-card {
    width: 400px;
  }
  .user-info-dropdown {
    width: 320px;
    background: white;

    .user-info-card {
      padding: 16px;
      display: flex;
      gap: 12px;
      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #ecf2ff;
        color: #05f;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .user-details {
        flex: 1;

        .user-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .username {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }

          .account-management {
            font-size: 12px;
            color: #666;
            cursor: pointer;

            &:hover {
              color: #1664ff;
            }
          }
        }

        .account-id {
          font-size: 12px;
          color: #999;
          margin: 8px 0;
        }

        .user-actions {
          margin-bottom: 10px;

          .verify-action {
            font-size: 14px;
            color: #1664ff;
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }

          .account-badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              color: #666;
              cursor: pointer;

              &.main-account {
                display: inline-block;
                background: #1664ff;
                color: white;
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 4px;
                cursor: default;
              }

              &.enterprise-verify:hover {
                background: #e6f3ff;
                border-color: #1664ff;
                color: #1664ff;
              }
            }
          }
        }

        .logout-button {
          width: 100%;
          padding: 8px 16px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #e0e0e0;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
