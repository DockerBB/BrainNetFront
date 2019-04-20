<template>
    <keep-alive :include="keepRoutes">
        <router-view></router-view>
    </keep-alive>
</template>
<script>
export default {
    name: 'my-view',
    data() {
        return {
            keepRoutes: []
        }
    },
    mounted() {
        if (this.$route.meta.keep) {
            this.keepRoutes.push(this.$route.name)
            this.$axios.get('/live')
        }
    }
}
</script>
<style lang='stylus'>
</style>
