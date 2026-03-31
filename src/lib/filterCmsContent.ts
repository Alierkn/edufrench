/** Sanity/Prisma modül kayıtlarında hedef filtreleme (boş = herkese açık) */
export function matchesUserProfile(
  targetGrades: string[] | null | undefined,
  targetSchools: string[] | null | undefined,
  userGrade: string | null | undefined,
  userSchool: string | null | undefined
): boolean {
  const gradesOk =
    !targetGrades?.length || (userGrade ? targetGrades.includes(userGrade) : false);
  const schoolsOk =
    !targetSchools?.length || (userSchool ? targetSchools.includes(userSchool) : false);
  return gradesOk && schoolsOk;
}
