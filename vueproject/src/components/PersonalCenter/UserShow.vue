<template>
    <v-container style="padding: 4px;">
        <v-card>
            <v-row style="text-align: left; vertical-align: middle; margin-top: 0px; margin-bottom: 10px; margin-left: 10px;">

                <v-avatar color="surface-variant"
                style="margin-top: 15px;margin-left: 10px; cursor: pointer;"
                size="33"
                :image="headImage"
                @click="clickHeadImage">
                </v-avatar>
                <v-col>
                    <span style="font-weight: bold; margin-left: 0px; font-size: 15px;">{{ nickname }}</span><br/>
                    <span style="color: grey; margin-left: 0px; font-size: 12px;">{{ sign }}</span>
                </v-col>

                <!-- <v-spacer></v-spacer> -->
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import router from '@/router';

//   该文件是用户列表中的一个表项视图
export default {
    name: "UserShow",
    props: {
        nickname: {
            type: String,
            required: true
        },
        // email: {
        //     type: String,
        //     required: true
        // },
        headImage: {
            type: String,
            required: true
        },
        sign: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },

    methods: {
        clickHeadImage() {
            // 跳转到otherCenter
            router.push({name: "othersCenter", params: {"id": this.id}})
        }
    }
};
</script>

<style scoped>

</style>
  