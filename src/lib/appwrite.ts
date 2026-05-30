import { Client, Databases, Account, ID, Query } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6a1acc280032b62f805b")
  .setKey("standard_a3a58122c0d924561c78dfbbd651450c03010ab55bb2fd4ce8bb96abff42eee394242594eff70911e021d7768871aab443cad0cde322fe81f00a78b6880a03f59f69db3d284456a0f90411d4082d1937d3d35b7e5bc433c5765797e667d36b3015cb66fbcb6a10ebb7e6ccf646cbf332bdd65acd6a5c74ff68b3c7b49c9c494d");

export const databases = new Databases(client);
export const DATABASE_ID = "zacampus";
export { ID, Query };
