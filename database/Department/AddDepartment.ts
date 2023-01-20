import { PrismaClient } from '@prisma/client'
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';
/**
 * 
 * @param newDepartment department information which will instead of old one;
 * @param prisma prisma client;
 * @returns all department information after update;
 */
async function AddNewDepartment(newDepartment: DepartmentInfo, prisma: PrismaClient): Promise<DepartmentInfo[]> {
    await prisma.department.create({
        data: {
            departmentName: newDepartment.departmentName,
            departmentColor: newDepartment.departmentColor
        },
    })
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany({
        orderBy: {
            departmentName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allDepartmnet);
    })
}
export default AddNewDepartment;