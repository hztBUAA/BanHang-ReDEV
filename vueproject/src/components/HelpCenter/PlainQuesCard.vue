<script>
import {ref, onMounted, onBeforeUnmount} from "vue";
import router from "@/router";
import UserAvatar from "@/components/HelpCenter/UserAvatar.vue";

export default {
  name: "PlainQuesCard",
  components: {UserAvatar},
  // 这里的question 类似一个model   具有字段
  props: ["question", "tags"],
  setup(props) {
    // 理解成就是为了显示前面摘要部分
    const truncate = (content) => {
      const strippedContent = content.replace(/<[^>]*>/g, "");
      if (strippedContent.length > 10) {
        return `${strippedContent.slice(0, 10)}...`;
      }
      return strippedContent;
    };

    const disTags = ref([])

    // 对于单个ques的tag打上标记
    const init = () => {
      for (let i = 0; i < props.question.tagIdList.length; i++) {
        for (let j = 0; j < props.tags.length; j++) {
          if (props.tags[j].tagId === props.question.tagIdList[i]) {
            disTags.value.push(props.tags[j])
          }
        }
      }
    }
    init()

    // 用于判断 点击了外面？
    const menuClick = ref(false);

    function handleClickOutside(event) {
      if (!event.composedPath().includes(this.$el)) {
        menuClick.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    // goto 函数的作用是导航到一个新的 URL，然后刷新页面（go （0））。
    const goto = () => {
      router.push("/QuesInfo/" + props.question.quesId + "/0").then(
          () => {
            router.go(0)
          }
      )
    }

    // 将日期整理成特定输出形式
    const formatDate = (time) => {
      let date = new Date(Date.parse(time))
      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并且保证两位数
      let day = ('0' + date.getDate()).slice(-2); // 保证两位数
      let hours = ('0' + date.getHours()).slice(-2); // 保证两位数
      let minutes = ('0' + date.getMinutes()).slice(-2); // 保证两位数

      return `${year}.${month}.${day}-${hours}:${minutes}`
    }

    return {truncate, menuClick, disTags, goto, formatDate};
  },
};
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
        class="mx-auto"
        width="96%"
        :class="`cursor-pointer`"
        :color="isHovering ? 'cyan-lighten-5' : undefined"
        v-bind="props"
        @click="goto()"
    >
      <v-row>
        <!-- 左侧的头像 -->
        <v-col cols="1" style="min-width: 50px">
          <UserAvatar :userId="question.userId" style="padding-left: 8px"></UserAvatar>
        </v-col>
        <!-- 正文内容  压缩过的 -->
        <v-col cols="7" style="text-align: left;" @click="goto">
          <div style="margin-top: 10px;">
            {{ truncate(question.quesContent.content) }}
          </div>
          <div style="font-size: 12px;color: grey">
            {{ question.userName }} 发表于 {{ formatDate(question.quesTime) }}
          </div>
        </v-col>
        <!-- 点赞 评论 -->
        <v-col cols="4" style="text-align: right;margin-top: 3px">
          <v-btn :prepend-icon="question.ifUserLike === 1 ?
                  'mdi-thumb-up-outline' : 'mdi-thumb-up'" variant="text" size="small"
                 color="blue-grey-lighten-2">
            {{ question.likeSum }}
          </v-btn>
          <v-btn variant="text " prepend-icon="mdi-message-text" size="small" color="blue-grey-lighten-2">
            {{ question.ansSum }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<style scoped>

</style>