<template>
    <div id="home" :style="background">
    </div>
</template>
<script>
    /* eslint-disable */
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
                }
            }
        },
        mounted() {
        },
        methods: {
            getURI: function(node) {
                let url = node.label;
                while (node.parent.label) {
                    url = node.parent.label + '/' + url;
                    node = node.parent
                }
                return url;
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
