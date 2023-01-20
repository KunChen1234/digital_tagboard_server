import { PrismaClient } from '@prisma/client'
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';

/**
 * 
 * @param newDepartment depatment information which will instead old one;
 * @param prisma prisma client;
 * @returns all department information from department table after updated;
 */
async function UpdateDepartmentInfo(newDepartment: DepartmentInfo, prisma: PrismaClient): Promise<DepartmentInfo[]> {
    if (newDepartment.departmentName) {
        await prisma.department.update({
            where: {
                departmentName: newDepartment.departmentName,
            },
            data: { departmentColor: newDepartment.departmentColor }
        })
    }
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany({
        orderBy: {
            departmentName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allDepartmnet);
    })

}

export default UpdateDepartmentInfo;