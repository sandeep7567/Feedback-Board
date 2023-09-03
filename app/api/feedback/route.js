import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async(request) => {

  // getting data from client
  const jsonBody = await request.json();

  const { title, description, uploads } = jsonBody;

  
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  
  const session = await getServerSession(authOptions);
  
  const userEmail = session?.user?.email;

  // console.log(title, description, uploads, userEmail)

  if(!title || !description || !userEmail ) {
    return Response.json({
      success: false,
      status: 400,
      message: "Please write mandatory fields"
    });
  };

  // db create data
  const data = await Feedback.create({title, description, uploads, userEmail})

  // console.log(data);

  // send res to client;
  return Response.json(data);

};

export const GET = async(req) => {
  const url = new URL(req.url);

  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);

  if(url?.searchParams?.get("id")) {
    return Response.json(
      await Feedback.findById(url?.searchParams?.get("id"))
    )
  } else {
    const sortParam = url.searchParams?.get("sort")
    const loadedRows = url?.searchParams?.get("loadedRows");
    const searchPhrase = url?.searchParams?.get("search");
    let sortDef;
    if (sortParam === "latest") {
      sortDef = {createdAt: -1};
    };
    if (sortParam === "oldest") {
      sortDef = {createdAt: 1};
    };
    if (sortParam === "votes") {
      sortDef = {votesCountCached: -1};
    };

    let filter = null;
    if (searchPhrase) {
      filter = {
        $or:[
          {title:{$regex:`.*${searchPhrase}.*`}},
          {description:{$regex:`.*${searchPhrase}.*`}},
        ]
      };
    };
    const updateVoteDoc = await Feedback.find(filter, null, {
      sort:sortDef,
      skip:loadedRows,
      limit: 10,
    }).populate("user")
    return Response.json(updateVoteDoc);
  };
};

export const PUT = async(request) => {
  // getting data from client
  const jsonBody = await request.json();

  const { id, title, description, uploads } = jsonBody;
  
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  
  const session = await getServerSession(authOptions);

  if(!session) {
    return Response.json(false)
  };

  const newFeedbackDoc = await Feedback.updateOne(
    {_id:id, userEmail:session.user.email},
    {title:title, description:description, uploads:uploads},
  );
  
  return Response.json(newFeedbackDoc);
};