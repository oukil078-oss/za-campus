import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Za-Campus database...");

  // Clean
  await prisma.finalQuizAnswer.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.finalQuizAttempt.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.finalQuizQuestion.deleteMany();
  await prisma.finalQuiz.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.file.deleteMany();
  await prisma.video.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.leaderboard.deleteMany();
  await prisma.module.deleteMany();
  await prisma.classStudent.deleteMany();
  await prisma.classTeacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // Admins
  await prisma.user.create({
    data: { email: "admin@zacampus.dz", passwordHash, firstName: "Karim", lastName: "Bennani", role: "ADMIN", admin: { create: { adminLevel: "SUPER" } } },
  });
  await prisma.user.create({
    data: { email: "admin2@zacampus.dz", passwordHash, firstName: "Amira", lastName: "Tahar", role: "ADMIN", admin: { create: { adminLevel: "STANDARD" } } },
  });

  // Teachers
  const teacherData: [string,string,string,string,string][] = [
    ["dr.mansouri@zacampus.dz","Ahmed","Mansouri","Computer Science","Artificial Intelligence"],
    ["dr.benali@zacampus.dz","Fatima","Benali","Mathematics","Applied Mathematics"],
    ["dr.khelifi@zacampus.dz","Omar","Khelifi","Physics","Quantum Physics"],
    ["dr.saadi@zacampus.dz","Leila","Saadi","Biology","Molecular Biology"],
    ["dr.rahmani@zacampus.dz","Youssef","Rahmani","Computer Science","Software Engineering"],
  ];
  const teacherUsers: any[] = [];
  for (let i = 0; i < teacherData.length; i++) {
    const u = await prisma.user.create({
      data: {
        email: teacherData[i][0], passwordHash, firstName: teacherData[i][1], lastName: teacherData[i][2],
        role: "TEACHER",
        teacher: { create: { employeeId: "EMP-2024-" + (1000+i), department: teacherData[i][3], specialization: teacherData[i][4] } }
      }
    });
    teacherUsers.push(u);
  }

  // Students
  const studentData: [string,string,string][] = [
    ["yasmine.boudiaf@zacampus.dz","Yasmine","Boudiaf"],
    ["mohamed.cherif@zacampus.dz","Mohamed","Cherif"],
    ["amina.djebar@zacampus.dz","Amina","Djebar"],
    ["sofiane.hamdi@zacampus.dz","Sofiane","Hamdi"],
    ["nadia.ferhat@zacampus.dz","Nadia","Ferhat"],
    ["rachid.belhadj@zacampus.dz","Rachid","Belhadj"],
    ["samira.ouldali@zacampus.dz","Samira","Ouldali"],
    ["amine.touati@zacampus.dz","Amine","Touati"],
    ["lina.merabet@zacampus.dz","Lina","Merabet"],
    ["hakim.ziane@zacampus.dz","Hakim","Ziane"],
    ["mehdi.boucherit@zacampus.dz","Mehdi","Boucherit"],
    ["sara.abdelkader@zacampus.dz","Sara","Abdelkader"],
    ["nabil.ghoul@zacampus.dz","Nabil","Ghoul"],
    ["ines.lamari@zacampus.dz","Ines","Lamari"],
    ["yacine.bennaceur@zacampus.dz","Yacine","Bennaceur"],
  ];
  const studentUsers: any[] = [];
  for (let i = 0; i < studentData.length; i++) {
    const u = await prisma.user.create({
      data: {
        email: studentData[i][0], passwordHash, firstName: studentData[i][1], lastName: studentData[i][2],
        role: "STUDENT",
        student: { create: { studentNumber: "STU-2024-" + String(i+1).padStart(4,"0") } }
      }
    });
    studentUsers.push(u);
  }

  console.log("Created " + (2 + teacherUsers.length + studentUsers.length) + " users");

  // Classes
  const classDefs: [string,string,string,number][] = [
    ["Introduction to Artificial Intelligence","CS-AI-101","Computer Science",0],
    ["Advanced Mathematics for Engineers","MATH-201","Mathematics",1],
    ["Quantum Mechanics","PHY-301","Physics",2],
    ["Software Engineering Principles","CS-SE-202","Computer Science",4],
    ["Molecular Biology Fundamentals","BIO-101","Biology",3],
  ];
  const classes: any[] = [];
  for (const cd of classDefs) {
    const t = await prisma.teacher.findFirst({ where: { userId: teacherUsers[cd[3]].id } });
    const cls = await prisma.class.create({
      data: {
        name: cd[0], code: cd[1], category: cd[2],
        description: "Comprehensive course on " + cd[0].toLowerCase() + ".",
        semester: "Fall 2024", academicYear: "2024-2025", maxStudents: 40, isPublished: true, isActive: true,
        teachers: { create: { teacherId: t!.id } }
      }
    });
    classes.push(cls);
  }

  const extraT = await prisma.teacher.findFirst({ where: { userId: teacherUsers[4].id } });
  await prisma.classTeacher.create({ data: { classId: classes[0].id, teacherId: extraT!.id } });

  // Enroll students
  for (let i = 0; i < studentUsers.length; i++) {
    const classIdx = i % classes.length;
    const st = await prisma.student.findFirst({ where: { userId: studentUsers[i].id } });
    await prisma.classStudent.create({ data: { classId: classes[classIdx].id, studentId: st!.id } });
    if (i < 5) {
      const sc = (classIdx + 1) % classes.length;
      await prisma.classStudent.create({ data: { classId: classes[sc].id, studentId: st!.id } });
    }
  }

  console.log("Created " + classes.length + " classes with enrollments");

  // Modules + content
  const moduleSets: string[][] = [
    ["Introduction & Overview","Core Concepts","Advanced Topics","Practical Applications","Final Assessment"],
    ["Calculus Review","Linear Algebra","Differential Equations","Numerical Methods","Applications"],
    ["Wave Functions","Schrodinger Equation","Quantum States","Measurement Theory","Applications"],
    ["SDLC & Methodologies","Version Control & Git","Design Patterns","Testing & QA","CI/CD & Deployment"],
    ["DNA & Replication","Transcription","Translation","Gene Regulation","Lab Techniques"],
  ];
  const allModules: any[] = [];
  const videoUrl = "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4";

  for (let ci = 0; ci < classes.length; ci++) {
    for (let mi = 0; mi < moduleSets[ci].length; mi++) {
      const mod = await prisma.module.create({
        data: { classId: classes[ci].id, title: "Module " + (mi+1) + ": " + moduleSets[ci][mi],
          description: "Comprehensive coverage of " + moduleSets[ci][mi].toLowerCase() + ".",
          orderIndex: mi, isPublished: true }
      });
      allModules.push(mod);

      await prisma.video.create({
        data: { moduleId: mod.id, title: "Video: " + moduleSets[ci][mi], url: videoUrl, duration: 2700, orderIndex: 0 }
      });
      await prisma.file.create({
        data: { moduleId: mod.id, title: "Notes: " + moduleSets[ci][mi],
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          fileType: "pdf", fileSize: 2048576, orderIndex: 0 }
      });

      const quiz = await prisma.quiz.create({
        data: { moduleId: mod.id, title: "Quiz: " + moduleSets[ci][mi],
          timeLimit: 30, passingScore: 60, maxAttempts: 3, isPublished: true }
      });

      const qs = [
        { q: "What is the primary focus of this module?", o: '["Theoretical foundations","Practical applications","Historical context","All of the above"]', a: "All of the above" },
        { q: "Which best describes the key concept?", o: '["Process-driven approach","Result-driven methodology","Hybrid framework","None of these"]', a: "Process-driven approach" },
        { q: "True or False: This has real-world applications.", o: '["True","False"]', a: "True" },
        { q: "What is recommended for beginners?", o: '["Start with advanced topics","Build fundamentals first","Focus only on theory","Skip to practical work"]', a: "Build fundamentals first" },
        { q: "How many core principles are covered?", o: '["2","3","4","5"]', a: "3" },
      ];
      for (let qi = 0; qi < qs.length; qi++) {
        await prisma.quizQuestion.create({
          data: { quizId: quiz.id, questionText: qs[qi].q,
            questionType: qi===2?"TRUE_FALSE":"MULTIPLE_CHOICE",
            options: qs[qi].o, correctAnswer: qs[qi].a, points: 1, orderIndex: qi }
        });
      }
    }
  }

  console.log("Created " + allModules.length + " modules with content");

  // Final quizzes
  for (const cls of classes) {
    const fq = await prisma.finalQuiz.create({
      data: { classId: cls.id, title: "Final Exam: " + cls.name,
        timeLimit: 120, passingScore: 60, maxAttempts: 3, isPublished: true }
    });
    const fqs = [
      { q: "Summarize key learning outcomes.", o: '["Technical proficiency","Theoretical understanding","Practical skills","All of the above"]', a: "All of the above" },
      { q: "Most effective methodology?", o: '["Agile","Waterfall","Hybrid","It depends on context"]', a: "It depends on context" },
      { q: "Expert vs beginner distinction?", o: '["Years of experience","Problem-solving ability","Theoretical knowledge","All apply equally"]', a: "All apply equally" },
      { q: "True or False: Continuous learning is essential.", o: '["True","False"]', a: "True" },
      { q: "Most important skill?", o: '["Technical skills","Critical thinking","Communication","All are interconnected"]', a: "All are interconnected" },
    ];
    for (let qi = 0; qi < fqs.length; qi++) {
      await prisma.finalQuizQuestion.create({
        data: { finalQuizId: fq.id, questionText: fqs[qi].q,
          questionType: qi===3?"TRUE_FALSE":"MULTIPLE_CHOICE",
          options: fqs[qi].o, correctAnswer: fqs[qi].a, points: 4, orderIndex: qi }
      });
    }
  }

  console.log("Created final quizzes");

  // Quiz attempts & grades
  for (let si = 0; si < Math.min(10, studentUsers.length); si++) {
    const st = await prisma.student.findFirst({ where: { userId: studentUsers[si].id } });
    if (!st) continue;
    const enrollments = await prisma.classStudent.findMany({ where: { studentId: st.id } });
    for (const enr of enrollments) {
      const modules = await prisma.module.findMany({ where: { classId: enr.classId }, orderBy: { orderIndex: "asc" } });
      for (const mod of modules.slice(0, 3)) {
        const quiz = await prisma.quiz.findFirst({ where: { moduleId: mod.id } });
        if (!quiz) continue;
        const questions = await prisma.quizQuestion.findMany({ where: { quizId: quiz.id } });
        const isTop = si < 5;
        const score = isTop ? 4 + Math.floor(Math.random()*2) : 2 + Math.floor(Math.random()*3);
        const total = questions.length;
        const attempt = await prisma.quizAttempt.create({
          data: { quizId: quiz.id, studentId: st.id, startedAt: new Date(Date.now()-86400000),
            submittedAt: new Date(), score, totalPoints: total,
            percentage: Math.round((score/total)*100),
            isPassed: (score/total)*100>=60, attemptNumber: 1,
            timeSpent: 600+Math.floor(Math.random()*900) }
        });
        for (const q of questions) {
          const opts = JSON.parse(q.options);
          const correct = Math.random() > (isTop ? 0.15 : 0.4);
          await prisma.quizAnswer.create({
            data: { attemptId: attempt.id, questionId: q.id,
              selectedAnswer: correct ? q.correctAnswer : opts[Math.floor(Math.random()*opts.length)],
              isCorrect: correct, pointsEarned: correct ? 1 : 0 }
          });
        }
        await prisma.grade.create({
          data: { studentId: st.id, classId: enr.classId, moduleId: mod.id, quizId: quiz.id,
            type: "MODULE_QUIZ", score, maxScore: total,
            percentage: Math.round((score/total)*100),
            isPassed: (score/total)*100>=60 }
        });
      }
      if (si < 8) {
        const fq = await prisma.finalQuiz.findFirst({ where: { classId: enr.classId } });
        if (fq) {
          const isTop = si < 5;
          const fs = isTop ? 14 + Math.floor(Math.random()*5) : 8 + Math.floor(Math.random()*5);
          const passed = fs >= 12;
          const fa = await prisma.finalQuizAttempt.create({
            data: { finalQuizId: fq.id, studentId: st.id,
              startedAt: new Date(Date.now()-7200000), submittedAt: new Date(),
              score: fs, totalPoints: 20, percentage: Math.round((fs/20)*100),
              isPassed: passed, attemptNumber: 1,
              timeSpent: 3600+Math.floor(Math.random()*3600) }
          });
          await prisma.grade.create({
            data: { studentId: st.id, classId: enr.classId, type: "FINAL_QUIZ",
              score: fs, maxScore: 20, percentage: Math.round((fs/20)*100), isPassed: passed }
          });
          if (passed) {
            const certNum = "CERT-"+classes.find((c:any)=>c.id===enr.classId)?.code+"-"+st.id.slice(0,8);
            await prisma.certificate.create({
              data: { studentId: studentUsers[si].id, classId: enr.classId,
                finalAttemptId: fa.id, certificateNumber: certNum,
                score: fs, maxScore: 20, status: "ISSUED" }
            });
            await prisma.notification.create({
              data: { userId: studentUsers[si].id, title: "Certificate Earned!",
                message: "Congratulations! You have earned your certificate.", type: "CERTIFICATE_EARNED" }
            });
          }
        }
      }
    }
  }

  console.log("Created quiz attempts and grades");

  // Leaderboards
  for (const cls of classes) {
    const enrollments = await prisma.classStudent.findMany({ where: { classId: cls.id } });
    const scores: {sid:string,ts:number}[] = [];
    for (const cs of enrollments) {
      const grades = await prisma.grade.findMany({ where: { studentId: cs.studentId, classId: cls.id } });
      const ts = grades.length > 0 ? grades.reduce((s,g)=>s+g.percentage,0)/grades.length : 0;
      scores.push({sid:cs.studentId,ts});
    }
    scores.sort((a,b)=>b.ts-a.ts);
    for (let i=0;i<scores.length;i++) {
      await prisma.leaderboard.create({
        data: { classId: cls.id, studentId: scores[i].sid,
          totalScore: scores[i].ts, rank: i+1, period: "ALL_TIME" }
      });
    }
  }

  console.log("Created leaderboards");

  // Notifications
  for (const u of studentUsers.slice(0,8)) {
    await prisma.notification.create({
      data: { userId: u.id, title: "Welcome to Za-Campus!",
        message: "Your learning journey begins now.", type: "SYSTEM" }
    });
  }

  console.log("\nSeed complete!");
  console.log("Admin: admin@zacampus.dz / password123");
  console.log("Teacher: dr.mansouri@zacampus.dz / password123");
  console.log("Student: yasmine.boudiaf@zacampus.dz / password123");
}

main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
