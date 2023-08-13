import { RoleEntity } from "src/modules/roles/role.entity";

const roles: Partial<RoleEntity>[] = [
    {
        name: "CLIENT",
        route: "/client",
        image: "test"
    },
    {
        name: "ADMIN",
        route: "/admin",
        image: "test"
    }
];

export default roles.map(roleData => {
    const role = new RoleEntity();
    role.name = roleData.name;
    role.route = roleData.route;
    role.image = roleData.image;
    return role;
});

