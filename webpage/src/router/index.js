// 引用模板
import Vue from 'vue';
import Router from 'vue-router';

import login from '../pages/login/login';
import index from '../pages/index';

Vue.use(Router)

export default new Router({
    model: history,
    routes: [{
            path: '/',
            name: 'App',
            component: () =>
                import ('../App'),
            redirect: '/login',
        }, {
            path: '/login',
            name: '登录',
            component: login
        },
        {
            path: '/index',
            name: '首页',
            component: index,
            children: [{
                path: '/index/index',
                component: () =>
                    import ('../pages/index/index')
            }]
        },
        {
            path: '/点餐管理',
            component: index,
            children: [{
                    path: '/order/orderManage',
                    component: () =>
                        import ('../pages/order/orderManage') //点餐页面
                },
                // {
                //     path: '/grade/decRecord',
                //     component: () =>
                //         import ('../pages/grade/decRecord')
                // },
                // {
                //     path: '/grade/gradeRank',
                //     component: () =>
                //         import ('../pages/grade/gradeRank')
                // },
                // {
                //     path: '/grade/datailDec',
                //     component: () =>
                //         import ('../pages/grade/datailDec')
                // },
                // {
                //     path: '/grade/departmentRank',
                //     component: () =>
                //         import ('../pages/grade/departmentRank')
                // }
            ]
        },
        {
            path: '/教学管理',
            component: index,
            children: [{
                    path: '/teaching/barrier',
                    component: () =>
                        import ('../pages/teach/entryStep')
                },
                {
                    path: '/teaching/myclass',
                    component: () =>
                        import ('../pages/teach/class'),

                },
                {
                    path: '/teach/teachPlan',
                    component: () =>
                        import ('../pages/teach/teachPlan')
                },
                {
                    path: '/teaching/leave',
                    component: () =>
                        import ('../pages/teach/leave')
                },
                {
                    path: '/teach/teachSummarize',
                    component: () =>
                        import ('../pages/teach/teachSummarize')
                }, {
                    path: '/teaching/myclassDetail',
                    name: '详情',
                    component: () =>
                        import ('../pages/teach/classDetail')

                }
            ]
        },

        {
            path: '/站内消息',
            name: '站内消息',
            component: index,
            children: [{
                    path: '/station/stationInfo',
                    component: () =>
                        import ('../pages/message/stationInfo')
                }, {
                    path: '/message/list',
                    component: () =>
                        import ('../pages/message/messagelist')
                },
                {
                    path: '/station/sendFile',
                    component: () =>
                        import ('../pages/message/upFile')
                },
                {
                    path: '/station/giveAdvice',
                    component: () =>
                        import ('../pages/message/upMind')
                },
                {
                    path: '/station/infoDetail',
                    component: () =>
                        import ('../pages/message/view')
                }
            ]
        },
        {
            path: '/学校公告',
            name: '学校公告',
            component: index,
            children: [{
                path: '/notice/schoolNotice',
                component: () =>
                    import ('../pages/notice/schoolNotice')
            }, {
                path: '/notice/noticeDetail',
                component: () =>
                    import ('../pages/notice/noticeDetail')
            }]
        },
        {
            path: '/我要举报',
            name: '我要举报',
            component: index,
            children: [{
                path: '/inform/informMsg',
                component: () =>
                    import ('../pages/inform/informMsg')
            }]
        },
    ]
})