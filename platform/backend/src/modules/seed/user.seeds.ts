import { GenderEnum } from "src/modules/users/gender.enum";
import { UserEntity } from "src/modules/users/user.entity";
import rolesSeed from 'src/modules/seed/role.seeds';

const users: Partial<UserEntity>[] = [
    {
        name: "David",
        lastname: "Fidalgo",
        email: "davidfidalgo@shopaholic.com",
        password: "123456",
        city: "Madrid",
        country: "Spain",
        language: "es-ES",
        gender: GenderEnum.MALE
    },
    {
        name: "Admin",
        lastname: "Admin",
        email: "admin@shopaholic.com",
        password: "123456",
        city: "Madrid",
        country: "Spain",
        language: "es-ES",
        gender: GenderEnum.MALE
    }
];

export default users.map(userData => {
    const user = new UserEntity();
    user.name = userData.name;
    user.lastname = userData.lastname;
    user.email = userData.email;
    user.password = userData.password;
    user.city = userData.city;
    user.country = userData.country;
    user.language = userData.language;
    user.gender = userData.gender;
    user.roles = rolesSeed;
    return user;
});

