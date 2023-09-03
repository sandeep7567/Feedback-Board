import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";

export const POST = async(request) => {
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);

  const jsonBody = await request.json();

  const session =  await getServerSession(authOptions);

  if(!session) {
    return Response.json(false);
  } 
  
  const commentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    feedbackId: jsonBody.feedbackId,
    userEmail: session.user.email,
  });
  
  return Response.json(commentDoc);
};

export const GET = async(request) => {
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);

  const url = new URL(request.url);

  if (!url?.searchParams?.get("feedbackId")) {
    return Response.json({
      message: "try again",
      status: 400,
      success: false,
    })
  }

  if (url?.searchParams?.get("feedbackId")) {

    const results = await Comment
      .find({feedbackId:url?.searchParams?.get("feedbackId")})
      .populate("user");

    // const commentDocs = results.map((result) => {
    //   const {userEmail, ...commentDocWithoutUserEmail} = result.toJSON();
    //   const { email, ...commentDocWithoutEmail } = commentDocWithoutUserEmail?.user;
    //   commentDocWithoutUserEmail.user = commentDocWithoutEmail;
      
    //   return commentDocWithoutUserEmail;
    // });

    return Response.json(results);
    
  };
  
  return Response.json(false);  
};

export const PUT = async(request) => {
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);

  // getting data from client
  const jsonBody = await request.json();
  const session = await getServerSession(authOptions);

  if(!session) {
    return Response.json(false)
  };

  const { id, text, uploads } = jsonBody;

  const updateCommentDoc = await Comment.findOneAndUpdate(
    {_id:id, userEmail:session.user.email},
    { text:text, uploads:uploads, },
  );
  
  return Response.json(updateCommentDoc);

};