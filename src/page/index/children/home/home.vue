<template>
    <div id="home">
        <div style="flex: 20;height: 100%">
            <file-list ref="file_list"></file-list>
        </div>
    </div>
</template>
<script>
    import FileList from "./home_fileList";
    export default {
        name: 'home',
        components: { FileList },
        data() {
            return {
            }
        },
        mounted() {
            this.selectNav('allFiles')
        },
        methods: {
            selectNav (selectFunction) {
                console.log(selectFunction)
                this.$refs['file_list'].initFilePackageContent(selectFunction)
            }
        }
    }
</script>
<style lang='stylus'>
#home {
}
</style>
