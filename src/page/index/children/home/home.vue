<template>
    <div id="home" :style="background">
        <div style="flex: 20;height: 100%">
            <!--<file-list ref="file_list"></file-list>-->
        </div>
        <!--<el-tree-->
                <!--:data="dialogData"-->
                <!--node-key="id"-->
                <!--:expand-on-click-node="true">-->
                <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
                    <!--<span v-if="data.children === undefined" @click="() => getURI(node)"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>-->
                    <!--<span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>-->
                <!--</span>-->
            <!--<a :href="getURI"><img src="@/assets/img/xiazai.png" height="16" width="16"/></a>-->
        <!--</el-tree>-->
        <!--<a :href="getURL"><img src="@/assets/img/xiazai.png" height="16" width="16"/></a>-->
    </div>
</template>
<script>
    /* eslint-disable */
    import FileList from "./home_fileList";
    import i18n from '@/language'
    export default {
        name: 'home',
        components: { FileList },
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("@/assets/img/background.jpg") + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                },
            }
        },
        mounted() {
            this.selectNav('allFiles')
        },
        methods: {
            selectNav (selectFunction) {
                console.log(selectFunction)
                this.$refs['file_list'].initFilePackageContent(selectFunction)
            },
            getURI: function(node) {
                let url = node.label;
                while (node.parent.label) {
                    url = node.parent.label + '/' + url;
                    node = node.parent
                }
                return url;
            },
            getURL:function () {
                return './src/assets/img/xiazai.png'
            }
        }
    }
</script>
<style lang='stylus'>
#home {
    position: relative;
    width: 100%;
    height: 100vh;
}
</style>
