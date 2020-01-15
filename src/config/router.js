import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const routes = [{
    path: '/',
    name: 'App',
    component: () =>
        import ('@/App'),
    redirect: '/login',
    children: [{
            path: '/login',
            name: 'Login',
            component: () =>
                import ('@/views/login')
        },
        {
            path: '/recover',
            name: 'Recover',
            component: () =>
                import ('@/views/recover')
        },
        {
            path: '/base',
            name: 'Base',
            redirect: '/base/basic/basic_index',
            meta: {
                name: '主页',
                path: 'base'
            },
            component: () =>
                import ('@/views/base'),
            children: [{
                    path: 'basic',
                    name: 'Basic',
                    redirect: '/base/basic/basic_index',
                    meta: {
                        name: '基础设置',
                        iconType: 'pay-circle',
                        key: 'ROLE_ADMIN',
                        path: 'base/basic',
                    },
                    component: {
                        template: '<router-view/>'
                    },
                    children: [{
                            path: 'basic_index',
                            name: 'BasicIndex',
                            meta: {
                                name: '数据统计',
                                path: 'basic_index',
                                fullPath: '/base/basic/basic_index'
                            },
                            component: () =>
                                import ('@/views/basic_index')
                        },
                        {
                            path: 'role_manage',
                            name: 'RoleManage',
                            meta: {
                                name: '角色管理',
                                path: 'role_manage',
                                fullPath: '/base/basic/role_manage'
                            },
                            component: () =>
                                import ('@/views/role_manage')
                        },
                        {
                            path: 'recommend_manage',
                            name: 'RecommendManage',
                            meta: {
                                name: '推荐管理',
                                path: 'recommend_manage',
                                fullPath: '/base/basic/recommend_manage'
                            },
                            component: () =>
                                import ('@/views/recommend_manage')
                        },
                        {
                            path: 'needs_manage',
                            name: 'NeedsManage',
                            meta: {
                                name: '需求管理',
                                path: 'needs_manage',
                                fullPath: '/base/basic/needs_manage'
                            },
                            component: () =>
                                import ('@/views/needs_manage')
                        },
                        {
                            path: 'needs_detail',
                            name: 'NeedsDetail',
                            meta: {
                                path: 'needs_detail',
                                fullPath: '/base/basic/needs_detail'
                            },
                            component: () =>
                                import ('@/views/needDetail')
                        },
                        {
                            path: 'oder_design',
                            name: 'OderDesign',
                            meta: {
                                name: '订单设计',
                                path: 'oder_design',
                                fullPath: '/base/basic/oder_design'
                            },
                            component: () =>
                                import ('@/views/oder_design')
                        },
                        {
                            path: 'oder_design_detail',
                            name: 'OderDesignDetail',
                            meta: {
                                path: 'oder_design_detail',
                                fullPath: '/base/basic/oder_design_detail'
                            },
                            component: () =>
                                import ('@/views/oder_design_detail')
                        }
                    ]
                },
                {
                    path: 'config',
                    name: 'Config',
                    redirect: '/base/config/teach_item',
                    meta: {
                        name: '基础配置',
                        iconType: 'solution',
                        key: 'TASK_MANAGE',
                        path: 'base/config',
                    },
                    component: {
                        template: '<router-view/>'
                    },
                    children: [{
                            path: 'teach_item',
                            name: 'TeachItem',
                            meta: {
                                name: '教学类目',
                                path: 'teach_item',
                                fullPath: '/base/config/teach_item'
                            },
                            component: () =>
                                import ('@/views/teach_item')
                        },
                        {
                            path: 'region_manage',
                            name: 'RegionManage',
                            meta: {
                                name: '地域管理',
                                path: 'region_manage',
                                fullPath: '/base/config/region_manage'
                            },
                            component: () =>
                                import ('@/views/region_manage')
                        },
                        {
                            path: 'teach',
                            name: 'Teach',
                            meta: {
                                name: '地域课程',
                                path: 'teach',
                                fullPath: '/base/config/teach'
                            },
                            component: () =>
                                import ('@/views/teach')
                        }
                    ]
                },
                {
                    path: 'custom',
                    name: 'Custom',
                    redirect: '/base/custom/custom_manage',
                    meta: {
                        name: '客户管理',
                        iconType: 'shop',
                        key: 'CREDIT_STORE_MANAGE',
                        path: 'base/custom'
                    },
                    component: {
                        template: '<router-view/>'
                    },
                    children: [{
                            path: 'custom_manage',
                            name: 'CustomManage',
                            meta: {
                                name: '客户列表',
                                path: 'store_manage',
                                fullPath: '/base/custom/custom_manage'
                            },
                            component: () =>
                                import ('@/views/custom_manage')
                        },
                        {
                            path: 'new_custom',
                            name: 'NewCustom',
                            meta: {
                                path: 'new_custom',
                                fullPath: '/base/custom/new_custom'
                            },
                            component: () =>
                                import ('@/views/new_custom')
                        },
                        {
                            path: 'custom_detail',
                            name: 'CustomDetail',
                            meta: {
                                path: 'custom_detail',
                                fullPath: '/base/custom/custom_detail'
                            },
                            component: () =>
                                import ('@/views/custom_detail')
                        }
                    ]
                }
            ]
        }
    ]
}]

export default new Router({ routes })
