<template>
    <div id="home" :style="background">
        <p>{{ content }}</p>
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
                },
                content: null
            }
        },
        mounted() {
            this.$axios.get('/public/BrainMesh_Ch2withCerebellum.nv').then(res => this.content = res.data.data)
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
