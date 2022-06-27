const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const uri = "mongodb+srv://leadadmin:MArtmsb2020@cluster0.qyvtm.mongodb.net/?retryWrites=true&w=majority";

// db
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");
    // get api to read all notes
    // http://localhost:8000/notes
    app.get("/notes", async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = notesCollection.find({});
      const result = await cursor.toArray();

      res.send(result);
    });

    // create notes taker
    // http://localhost:8000/note
    /**
         *Body= {
    "userName":"Abdur Rahman Talha",
    "textdata":"This is my to do list"
}
         * */

    app.post("/note", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    // update notes taker
    // http://localhost:8000/note/62b8a3782130511fa778ed59

    app.put("/note/:id",async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const data=req.body;
        console.log("From update api",data);
        const filter={_id:ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            // option1
            // $set:{
            // //    userName:data.userName,
            // //    textdata:data.textdata
            // }

            // option2
            // $set:data

            // option3
            $set:{
                ...data
            }
        }
        const result=await notesCollection.updateOne(filter,updateDoc,options);
        res.send(result)
    })

    // delete notes taker
    // http://localhost:8000/note/62b8a3782130511fa778ed59
    
    app.delete('/note/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id:ObjectId(id)};
        const result =await notesCollection.deleteOne(filter);
        res.send(result);
    })

  } finally {
  }
};
run().catch(console.dir);

const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
