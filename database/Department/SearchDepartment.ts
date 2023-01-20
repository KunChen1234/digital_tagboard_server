import { PrismaClient } from '@prisma/client'
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';
/**
 * 
 * @param prisma prisma client
 * @returns all information of department in department table from database;
 */
async function getAllDepartment(prisma: PrismaClient): Promise<DepartmentInfo[] | undefined> {
    try {
        const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany(
            {
                orderBy: {
                    departmentName: "asc"
                }
            }
        )
        // console.log(allDepartmnet);
        return new Promise((resolve) => {
            resolve(allDepartmnet);
        })
    }
    catch (e) {
        // console.log("can not find data from department table");
        // console.log(e);
    }
}
export default getAllDepartment;