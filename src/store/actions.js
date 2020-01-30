import jwt_decode from 'jwt-decode';
import { asyncRouterMap } from '../router';
const actions = {
    async setUser({ state, commit }, user) {
        const decode = jwt_decode(user);
        commit("SET_USER", decode);
        const { key } = decode;
        let accessRouters = filterAsyncRouter(asyncRouterMap, key);
        commit("SET_ROUTERS", accessRouters);
    }
};
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles);
            }
            return true;
        }
        return false;
    });
    return accessRouters;
}
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        // 如果meta.roles是否包含角色的key值,如果包含那么就是有权限,否则无权限
        return route.meta.roles.some((role) => role.indexOf(roles) >= 0);
    }
    else {
        // 默认不设置有权限
        return true;
    }
}
export default actions;
//# sourceMappingURL=actions.js.map