<template>
    <vue-position-sticky sticky-class="sticky-class">
        <el-aside id="side" width="190px">
            <!-- menu -->
            <el-menu id="menuItem" :default-active="$route.name" :default-openeds="defaultOpeneds" background-color="#304156" text-color="#bfcbd9" active-text-color="#42b983">
                <my-side-item :json="filterRoutes"></my-side-item>
            </el-menu>
            <router-view name="sideOption" style="background-color: #304156;"></router-view>
        </el-aside>
    </vue-position-sticky>
</template>
<script>
import { sideRoutes } from '@/router'
export default {
    name: 'my-side',
    data() {
        return {
            filterRoutes: [], // 过滤后的路由
            defaultOpeneds: [] // 默认打开的二级菜单
        }
    },
    created() {
        this.filterRoutes = this.handleRoutes(sideRoutes)
    },
    methods: {
        // 递归过滤路由
        handleRoutes(Arr) {
            const Routes = Arr.filter(route => {
                if (route.name) {
                    if (route.meta) {
                        if (route.meta.hidden) {
                            return false
                        } else {
                            if (route.meta.open) {
                                this.defaultOpeneds.push(route.name)
                            }
                        }
                    }
                    if (route.children) {
                        route.children = this.handleRoutes(route.children)
                    }
                    return true
                } else {
                    return false
                }
            })
            return Routes
        }
    }
}
</script>
<style lang='stylus'>
.sticky-class {
    height: 100%;
}
#side {
    display: flex;
    flex-direction: column;
    height: 100%;
    user-select: none;
    overflow-x: hidden;
    .el-menu {
        flex-grow: 1;
        padding-bottom: 15px;
        border: none;
        .el-menu-item {
            min-width: 180px;
        }
    }
}
</style>
