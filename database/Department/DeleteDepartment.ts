import { PrismaClient } from '@prisma/client'
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';
/**
 * 
 * @param name the name of department which will be deleted;
 * @param prisma prisma client;
 * @returns all department information after updated;
 */
async function DeleteOneDepartment(name: string, prisma: PrismaClient): Promise<DepartmentInfo[] | undefined> {
    await prisma.department.delete({
        where: {
            departmentName: name
        }
    })
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany(
        {
            orderBy: {
                departmentName: "asc"
            }
        }
    );
    return new Promise((resolve) => {
        resolve(allDepartmnet);
    })
}
export default DeleteOneDepartment;
