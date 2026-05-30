import { databases, DATABASE_ID, ID, Query } from "./appwrite";
export { ID, Query };

const cols: Record<string,string> = {
  user:"users",admin:"admins",teacher:"teachers",student:"students",
  class:"classes",classTeacher:"class_teachers",classStudent:"class_students",
  module:"modules",video:"videos",file:"files",quiz:"quizzes",
  quizQuestion:"quiz_questions",quizAttempt:"quiz_attempts",quizAnswer:"quiz_answers",
  finalQuiz:"final_quizzes",finalQuizQuestion:"final_quiz_questions",
  finalQuizAttempt:"final_quiz_attempts",finalQuizAnswer:"final_quiz_answers",
  grade:"grades",certificate:"certificates",leaderboard:"leaderboards",
  notification:"notifications",auditLog:"audit_logs",
};

function bq(filter?:any,orderBy?:any,take?:number):string[]{const q:string[]=[];if(filter){for(const[k,v]of Object.entries(filter)){if(v===undefined||v===null)continue;if(typeof v==="object"&&v!==null){if("contains"in v)q.push(Query.contains(k,String((v as any).contains)));else if("gte"in v)q.push(Query.greaterThanEqual(k,String((v as any).gte)));else if("in"in v)q.push(Query.equal(k,(v as any).in));}else q.push(Query.equal(k,String(v)));}}if(orderBy){for(const[k,d]of Object.entries(orderBy)){q.push(d==="desc"?Query.orderDesc(k):Query.orderAsc(k));}}if(take)q.push(Query.limit(take));return q;}

async function fm(c:string,filter?:any,orderBy?:any,take?:number){try{const r=await databases.listDocuments(DATABASE_ID,c,bq(filter,orderBy,take));return r.documents.map((d:any)=>({id:d.$id,...d}));}catch{return[];}}
async function ff(c:string,filter?:any){const r=await fm(c,filter,undefined,1);return r[0]||null;}
async function fu(c:string,id:string){try{const d=await databases.getDocument(DATABASE_ID,c,id);return{id:d.$id,...d};}catch{return null;}}
async function cr(c:string,data:any){const id=data.id||ID.unique();const dd:any={};for(const[k,v]of Object.entries(data)){if(v!==undefined&&v!==null)dd[k]=String(v);}await databases.createDocument(DATABASE_ID,c,id,dd);return{id,...dd};}
async function up(c:string,id:string,data:any){const dd:any={};for(const[k,v]of Object.entries(data)){if(v!==undefined&&v!==null)dd[k]=String(v);}await databases.updateDocument(DATABASE_ID,c,id,dd);return{id,...dd};}
async function rm(c:string,id:string){await databases.deleteDocument(DATABASE_ID,c,id);}
async function ct(c:string,filter?:any){return(await fm(c,filter)).length;}

export const db={
  user:{findUnique:(o:any)=>fu(cols.user,o.where.id||""),findFirst:(o:any)=>ff(cols.user,o.where),findMany:(o?:any)=>fm(cols.user,o?.where,o?.orderBy),count:(o?:any)=>ct(cols.user,o?.where),create:(o:any)=>cr(cols.user,o.data),update:(o:any)=>up(cols.user,o.where.id||"",o.data),delete:(o:any)=>rm(cols.user,o.where.id||"")},
  admin:{findUnique:(o:any)=>ff(cols.admin,o.where),findMany:(o?:any)=>fm(cols.admin,o?.where),create:(o:any)=>cr(cols.admin,o.data)},
  teacher:{findUnique:(o:any)=>ff(cols.teacher,o.where),findFirst:(o:any)=>ff(cols.teacher,o.where),findMany:(o?:any)=>fm(cols.teacher,o?.where),create:(o:any)=>cr(cols.teacher,o.data)},
  student:{findUnique:(o:any)=>ff(cols.student,o.where),findFirst:(o:any)=>ff(cols.student,o.where),findMany:(o?:any)=>fm(cols.student,o?.where),create:(o:any)=>cr(cols.student,o.data)},
  class:{findUnique:(o:any)=>fu(cols.class,o.where.id||""),findMany:(o?:any)=>fm(cols.class,o?.where,o?.orderBy),count:()=>ct(cols.class),create:(o:any)=>cr(cols.class,o.data),update:(o:any)=>up(cols.class,o.where.id||"",o.data),delete:(o:any)=>rm(cols.class,o.where.id||"")},
  classTeacher:{create:(o:any)=>cr(cols.classTeacher,o.data),findMany:(o:any)=>fm(cols.classTeacher,o.where)},
  classStudent:{create:(o:any)=>cr(cols.classStudent,o.data),findMany:(o:any)=>fm(cols.classStudent,o.where),findFirst:(o:any)=>ff(cols.classStudent,o.where)},
  module:{findUnique:(o:any)=>ff(cols.module,o.where),findFirst:(o:any)=>ff(cols.module,o.where),findMany:(o?:any)=>fm(cols.module,o?.where,o?.orderBy),count:()=>ct(cols.module),create:(o:any)=>cr(cols.module,o.data),update:(o:any)=>up(cols.module,o.where.id||"",o.data),delete:(o:any)=>rm(cols.module,o.where.id||"")},
  video:{create:(o:any)=>cr(cols.video,o.data),findMany:(o:any)=>fm(cols.video,o.where,o.orderBy),count:()=>ct(cols.video)},
  file:{create:(o:any)=>cr(cols.file,o.data),findMany:(o:any)=>fm(cols.file,o.where,o.orderBy),count:()=>ct(cols.file)},
  quiz:{findUnique:(o:any)=>ff(cols.quiz,o.where),findFirst:(o:any)=>ff(cols.quiz,o.where),findMany:(o:any)=>fm(cols.quiz,o.where),count:()=>ct(cols.quiz),create:(o:any)=>cr(cols.quiz,o.data)},
  quizQuestion:{findMany:(o:any)=>fm(cols.quizQuestion,o.where,o.orderBy),create:(o:any)=>cr(cols.quizQuestion,o.data)},
  quizAttempt:{findMany:(o:any)=>fm(cols.quizAttempt,o.where,o.orderBy,o.take),count:(o:any)=>ct(cols.quizAttempt,o.where),create:(o:any)=>cr(cols.quizAttempt,o.data),update:(o:any)=>up(cols.quizAttempt,o.where.id||"",o.data)},
  quizAnswer:{create:(o:any)=>cr(cols.quizAnswer,o.data)},
  finalQuiz:{findUnique:(o:any)=>ff(cols.finalQuiz,o.where),findFirst:(o:any)=>ff(cols.finalQuiz,o.where),findMany:(o:any)=>fm(cols.finalQuiz,o.where),create:(o:any)=>cr(cols.finalQuiz,o.data)},
  finalQuizQuestion:{findMany:(o:any)=>fm(cols.finalQuizQuestion,o.where,o.orderBy),create:(o:any)=>cr(cols.finalQuizQuestion,o.data)},
  finalQuizAttempt:{findMany:(o:any)=>fm(cols.finalQuizAttempt,o.where,o.orderBy),count:(o:any)=>ct(cols.finalQuizAttempt,o.where),create:(o:any)=>cr(cols.finalQuizAttempt,o.data),update:(o:any)=>up(cols.finalQuizAttempt,o.where.id||"",o.data)},
  finalQuizAnswer:{create:(o:any)=>cr(cols.finalQuizAnswer,o.data)},
  grade:{create:(o:any)=>cr(cols.grade,o.data),findMany:(o:any)=>fm(cols.grade,o.where,o.orderBy),findFirst:(o:any)=>ff(cols.grade,o.where)},
  certificate:{create:(o:any)=>cr(cols.certificate,o.data),findMany:(o?:any)=>fm(cols.certificate,o?.where,o?.orderBy),findFirst:(o:any)=>ff(cols.certificate,o.where),count:()=>ct(cols.certificate)},
  leaderboard:{findMany:(o?:any)=>fm(cols.leaderboard,o?.where,o?.orderBy,o?.take),create:(o:any)=>cr(cols.leaderboard,o.data)},
  notification:{create:(o:any)=>cr(cols.notification,o.data),findMany:(o:any)=>fm(cols.notification,o.where,o.orderBy,o.take),count:(o:any)=>ct(cols.notification,o.where),update:(o:any)=>up(cols.notification,o.where.id||"",o.data),updateMany:async(o:any)=>{const docs=await fm(cols.notification,o.where);for(const doc of docs)await up(cols.notification,doc.id,o.data);}},
  auditLog:{create:(o:any)=>cr(cols.auditLog,o.data),findMany:(o?:any)=>fm(cols.auditLog,o?.where,o?.orderBy,o?.take)},
};
