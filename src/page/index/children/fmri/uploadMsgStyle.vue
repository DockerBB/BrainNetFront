<template>
    <span>文件上传({{uploadcount}}/{{totalcount}})</span>
</template>

<script>
    export default {
        name: 'uploadMsgStyle',
        props: {
            uploadcount: Number,
            totalcount: Number,
            percent: Number
        }
    }
</script>

<style scoped>

</style>
