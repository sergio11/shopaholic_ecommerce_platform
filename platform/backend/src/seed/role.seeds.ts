import { RoleEntity } from "src/modules/roles/role.entity";


const clientRole: RoleEntity = new RoleEntity();
const adminRole: RoleEntity = new RoleEntity();

clientRole.name = "CLIENT";
clientRole.route = "/client";
clientRole.image = "test";
adminRole.name = "ADMIN";
adminRole.route = "/admin";
adminRole.image = "test";

export default [
    clientRole,
    adminRole
];