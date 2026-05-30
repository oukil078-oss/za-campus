import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PostgreSQL...");
  const passwordHash = await bcrypt.hash("password123", 12);

  // Check if already seeded
  const existing = await prisma.user.count();
  if (existing > 0) { console.log("Already seeded, skipping."); return; }

  // Admins
  await prisma.user.create({ data: { email: "admin@zacampus.dz", passwordHash, firstName: "Karim", lastName: "Bennani", role: "ADMIN", admin: { create: { adminLevel: "SUPER" } } } });
  await prisma.user.create({ data: { email: "admin2@zacampus.dz", passwordHash, firstName: "Amira", lastName: "Tahar", role: "ADMIN", admin: { create: { adminLevel: "STANDARD" } } } });

  // Teachers
  const td=[["dr.mansouri@zacampus.dz","Ahmed","Mansouri","CS","AI"],["dr.benali@zacampus.dz","Fatima","Benali","Math","Applied Math"],["dr.khelifi@zacampus.dz","Omar","Khelifi","Physics","Quantum"],["dr.saadi@zacampus.dz","Leila","Saadi","Bio","Molecular"],["dr.rahmani@zacampus.dz","Youssef","Rahmani","CS","Software Eng"]];
  const teachers=[];
  for(let i=0;i<td.length;i++){
    const u=await prisma.user.create({data:{email:td[i][0],passwordHash,firstName:td[i][1],lastName:td[i][2],role:"TEACHER",teacher:{create:{employeeId:"EMP-2024-"+(1000+i),department:td[i][3],specialization:td[i][4]}}}});
    teachers.push(u);
  }

  // Students
  const sd=[["yasmine.boudiaf@zacampus.dz","Yasmine","Boudiaf"],["mohamed.cherif@zacampus.dz","Mohamed","Cherif"],["amina.djebar@zacampus.dz","Amina","Djebar"],["sofiane.hamdi@zacampus.dz","Sofiane","Hamdi"],["nadia.ferhat@zacampus.dz","Nadia","Ferhat"],["rachid.belhadj@zacampus.dz","Rachid","Belhadj"],["samira.ouldali@zacampus.dz","Samira","Ouldali"],["amine.touati@zacampus.dz","Amine","Touati"],["lina.merabet@zacampus.dz","Lina","Merabet"],["hakim.ziane@zacampus.dz","Hakim","Ziane"]];
  const students=[];
  for(let i=0;i<sd.length;i++){
    const u=await prisma.user.create({data:{email:sd[i][0],passwordHash,firstName:sd[i][1],lastName:sd[i][2],role:"STUDENT",student:{create:{studentNumber:"STU-2024-"+String(i+1).padStart(4,"0")}}}});
    students.push(u);
  }

  // Classes
  const cd=[["Intro to AI","CS-AI-101","CS",0],["Advanced Math","MATH-201","Math",1],["Quantum Mechanics","PHY-301","Physics",2],["Software Engineering","CS-SE-202","CS",4],["Molecular Biology","BIO-101","Bio",3]];
  const classes=[];
  for(const c of cd){
    const t=await prisma.teacher.findFirst({where:{userId:teachers[c[3]].id}});
    const cl=await prisma.class.create({data:{name:c[0],code:c[1],category:c[2],description:"Course on "+c[0].toLowerCase(),semester:"Fall 2024",academicYear:"2024-2025",maxStudents:40,isPublished:true,isActive:true,teachers:{create:{teacherId:t!.id}}}});
    classes.push(cl);
  }

  // Enroll
  for(let i=0;i<students.length;i++){
    const ci=i%classes.length;
    const st=await prisma.student.findFirst({where:{userId:students[i].id}});
    await prisma.classStudent.create({data:{classId:classes[ci].id,studentId:st!.id}});
  }

  // Modules + content
  const ms=[["Intro","Core","Advanced","Practical","Final"],["Calc Review","Linear Alg","Diff Eq","Numerical","Applications"],["Wave Func","Schrodinger","Quantum States","Measurement","Apps"],["SDLC","Git","Design Patterns","Testing","CI/CD"],["DNA","Transcription","Translation","Regulation","Lab"]];
  const vu="https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";
  
  for(let ci=0;ci<classes.length;ci++){
    for(let mi=0;mi<ms[ci].length;mi++){
      const mod=await prisma.module.create({data:{classId:classes[ci].id,title:"Module "+(mi+1)+": "+ms[ci][mi],description:"Coverage of "+ms[ci][mi].toLowerCase(),orderIndex:mi,isPublished:true}});
      await prisma.video.create({data:{moduleId:mod.id,title:"Video: "+ms[ci][mi],url:vu,duration:2700,orderIndex:0}});
      await prisma.file.create({data:{moduleId:mod.id,title:"Notes: "+ms[ci][mi],url:"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",fileType:"pdf",fileSize:2048576,orderIndex:0}});
      const qz=await prisma.quiz.create({data:{moduleId:mod.id,title:"Quiz: "+ms[ci][mi],timeLimit:30,passingScore:60,maxAttempts:3,isPublished:true}});
      const qs=[{q:"Focus of this module?",o:JSON.stringify(["Theory","Practice","History","All"]),a:"All"},{q:"Key concept?",o:JSON.stringify(["Process","Result","Hybrid","None"]),a:"Process"},{q:"Has real-world applications?",o:JSON.stringify(["True","False"]),a:"True"},{q:"Recommended for beginners?",o:JSON.stringify(["Advanced","Fundamentals","Theory only","Skip to practice"]),a:"Fundamentals"},{q:"Core principles count?",o:JSON.stringify(["2","3","4","5"]),a:"3"}];
      for(let qi=0;qi<qs.length;qi++)await prisma.quizQuestion.create({data:{quizId:qz.id,questionText:qs[qi].q,questionType:qi===2?"TRUE_FALSE":"MULTIPLE_CHOICE",options:qs[qi].o,correctAnswer:qs[qi].a,points:1,orderIndex:qi}});
    }
  }

  // Final quizzes
  for(const cl of classes){
    const fq=await prisma.finalQuiz.create({data:{classId:cl.id,title:"Final Exam: "+cl.name,timeLimit:120,passingScore:60,maxAttempts:3,isPublished:true}});
    const fqs=[{q:"Key learning outcomes?",o:JSON.stringify(["Technical","Theoretical","Practical","All"]),a:"All"},{q:"Most effective methodology?",o:JSON.stringify(["Agile","Waterfall","Hybrid","Depends"]),a:"Depends"},{q:"Expert vs beginner?",o:JSON.stringify(["Experience","Problem-solving","Knowledge","All"]),a:"All"},{q:"Continuous learning essential?",o:JSON.stringify(["True","False"]),a:"True"},{q:"Most important skill?",o:JSON.stringify(["Technical","Critical thinking","Communication","All"]),a:"All"}];
    for(let qi=0;qi<fqs.length;qi++)await prisma.finalQuizQuestion.create({data:{finalQuizId:fq.id,questionText:fqs[qi].q,questionType:qi===3?"TRUE_FALSE":"MULTIPLE_CHOICE",options:fqs[qi].o,correctAnswer:fqs[qi].a,points:4,orderIndex:qi}});
  }

  console.log("Seed complete! " + (await prisma.user.count()) + " users, " + (await prisma.class.count()) + " classes");
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
