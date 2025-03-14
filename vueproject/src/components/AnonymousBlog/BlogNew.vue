<template>
  <v-card class="blog-new">
    <input v-model="title" placeholder="标题(不超过50个字符)" class="title-input" maxlength="50">
    <!-- 文字编辑区域 -->
    <el-input v-model="content" rows="15" type="textarea" placeholder="帖子内容(不超过10000个字符)"
              style="margin-bottom: 5px" maxlength="10000"></el-input>

    <!-- 图片上传区域 -->
    <div class="file-upload-container">
      <label for="fileInput" class="custom-file-upload">
        上传图片
      </label>
      <input id="fileInput" type="file" @change="handleFileUpload" accept="image/*" multiple class="image-upload-input">
    </div>

    <div v-if="isUploading" class="loading-indicator">
      图片上传中...
    </div>

    <div class="image-preview">
      <div v-for="(image, index) in imagePreviews" :key="index" class="preview-container">
        <img :src="image" class="preview-image"/>
        <button @click="removeImage(index)" class="remove-button">×</button>
      </div>
    </div>

    <v-select
        v-model="tagList"
        :items="tagNamesArray"
        multiple
        label="添加标签"
        density="default"
    >
      <template v-slot:selection="{item}">
        <v-chip size="x-small" :color="tags[tagNamesArray.indexOf(item.title)].tagColor">
          <v-icon>{{ tags[tagNamesArray.indexOf(item.title)].tagIcon }}</v-icon>
          {{ item.title }}
        </v-chip>
      </template>
    </v-select>

    <!--    <div class="tag-checkboxes">-->
    <!--      <v-checkbox v-model="tagList" :label="tag.tagName" :value="tag.tagId" :color="tag.tagColor" v-for="tag in tags"-->
    <!--                  :key="tag.tagId"></v-checkbox>-->
    <!--    </div>-->

    <div class="anonymous_checkbox">
      <v-checkbox v-model="ifAnonymous" label="匿名发布"></v-checkbox>
    </div>

    <div class="post_options">
      <!-- 发帖按钮 -->
      <v-btn @click="submitBlog" class="ma-3" color="blue">发帖
        <v-icon
            icon="mdi-send"
            end
        ></v-icon>
      </v-btn>
    </div>
  </v-card>

</template>

<script>

import {getTags, uploadBlog} from "@/components/AnonymousBlog/api";
import {ElMessage} from "element-plus";
import axios from "axios";
import {showTip} from "@/components/AccountManagement/AccountManagementAPI";

export default {
  name: "BlogNew",
  data() {
    return {
      title: "", //帖子标题
      content: "", // 帖子内容
      images: [], // 上传的图片文件
      imagePreviews: [], // 图片预览数组，用于回显上传的图片
      ifAnonymous: true,  // 是否匿名
      tagList: [], //标签名列表
      tagNamesArray: [],
      tags: [],
      isUploading: false,
    };
  },
  created() {
    getTags().then(tags => {
      console.log("Tags:", tags); // 检查getTags()返回的标签列表
      this.tags = tags;
      this.tagNamesArray = tags.map(tag => tag.tagName);
    }).catch(error => {
      console.error("Failed to fetch tags:", error);
    });
  },
  methods: {
    // 处理图片上传
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files) return;
      if (this.images.length + files.length > 15) {
        showTip("图片上限为 15 张，请适当减少您的图片数量~", false)
        return;
      }

      this.isUploading = true;

      const uploadPromises = [];

      // 遍历上传的图片文件，生成预览并存入图片预览数组
      for (let i = 0; i < files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.imagePreviews.push(e.target.result);
        };
        fileReader.readAsDataURL(files[i]);

        let form = new FormData();
        form.append("file", files[i]);

        // 上传图片
        const uploadPromise = axios({
          method: "post",
          url: "https://banhang.lyhtool.com:8000/uploadfile/",
          data: form,
          headers: {'Content-Type': 'multipart/form-data'}
        }).then((res) => {
          const data = res.data;
          if (data.response == 'success') {
            console.log(data.fileUrl);
            this.images.push(data.fileUrl);
          } else {
            showTip("图片上传失败, 请重新尝试!", false);
          }
        }).catch(() => {
          showTip("图片上传失败, 请重新尝试!", false);
        });

        uploadPromises.push(uploadPromise);
      }

      // 所有图片上传完成后，隐藏加载提示
      Promise.all(uploadPromises).finally(() => {
        this.isUploading = false;
      });
    },
    // 移除已上传的图片
    removeImage(index) {
      this.imagePreviews.splice(index, 1);
      this.images.splice(index, 1);
    },

    transNameListToTagList(tagList) {
      let tagIds = [];

      tagList.forEach(tagName => {
        let tag = this.tags.find(tag => tag.tagName === tagName);
        if (tag) {
          tagIds.push(tag.tagId);
        }
      });
      return tagIds
    },

    // 提交帖子
    submitBlog() {
      // 弹出确认框，让用户确认是否提交
      // console.log(this.tagList)
      if (this.isUploading) {
        showTip('图片正在上传中，请稍后再试~')
        return
      }

      if (this.title.trim().length === 0 || this.content.trim().length === 0) {
        showTip('标题和内容不能为空，请返回修改~')
        return
      }

      const confirmSubmit = window.confirm("确定要发布该帖吗？👀");
      if (confirmSubmit) {
        // 执行提交操作，比如将内容和图片上传到后端数据库
        // let form = new FormData
        // form.append("title", this.title)
        // form.append("content", this.content)
        // form.append("imageList", this.images)
        // form.append("ifAnonymous", this.ifAnonymous)
        // form.append("tagList", this.transNameListToIdList(this.tagList))
        let json_set = {
          "title": this.title,
          "content": this.content,
          "imageList": this.images,
          "ifAnonymous": this.ifAnonymous,
          "tagList": this.transNameListToTagList(this.tagList)
        }
        uploadBlog(json_set).then(
            (res) => {
              if (res.response == "success") {
                ElMessage({
                  message: '帖子发布成功',
                  showClose: true,
                  type: 'success',
                })
                this.$router.push({name: 'blogList', params: {tagId: -1}})
              } else {
                ElMessage({
                  message: '发帖失败，请修改内容或稍后再试',
                  showClose: true,
                  type: 'error',
                })
              }
            }
        )

      }
    },
  },
};
</script>

<style scoped>
.blog-new {
  margin: 20px 2% 100px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}


.content-textarea {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.file-upload-container {
  margin-bottom: 20px;
  display: flex;
  align-self: flex-start;
}

/* 隐藏原生文件上传按钮 */
.image-upload-input {
  display: none;
}

/* 自定义上传按钮样式 */
.custom-file-upload {
  background-color: #0291ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-bottom: 10px;
  align-self: flex-start;
}

/* 自定义上传按钮悬停样式 */
.custom-file-upload:hover {
  background-color: #0048b3;
}

/* 上传中状态样式 */
.custom-file-upload.is-loading {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 加载提示样式 */
.loading-indicator {
  color: #0291ff;
  font-size: 14px;
  margin-top: 10px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
}

.preview-container {
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
}

.preview-image {
  max-height: 100px;
  max-width: 100px;
  border-radius: 5px;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #ff0000;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 0;
  font-size: 12px;
  cursor: pointer;
}

.post_options {
  display: flex;
  justify-content: flex-end;
}

.tag-checkboxes {
  display: flex;
  flex-wrap: wrap;
}

.anonymous_checkbox {
  align-self: flex-end;
}

.post-button {
  padding: 10px 20px;
  background-color: #0291ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.post-button:hover {
  background-color: #0048b3;
}
</style>
