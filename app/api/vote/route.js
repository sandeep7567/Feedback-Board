import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Vote } from "@/app/models/Vote";
import { Feedback } from "@/app/models/Feedback";
 
const recountVotes = async(feedbackId) => {
  const count = await Vote.countDocuments({feedbackId});
  
  await Feedback.updateOne(
    {_id:feedbackId},
    {votesCountCached: count,}
  );
};

export const POST = async(request) => {
  
  // connect to db
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);

  const jsonBody = await request.json();
  const { feedbackId } = jsonBody;

  const session = await getServerSession(authOptions);

  const {user:{email:userEmail}} = session;

  // console.log(feedbackId, session);

  const existingVote = await Vote.findOne({feedbackId, userEmail});
  
  if(existingVote) {
    await Vote.findByIdAndDelete(existingVote._id)
    await recountVotes(feedbackId);
    return Response.json(existingVote);
  } else {
    const voteDoc = await Vote.create({feedbackId, userEmail});
    await recountVotes(feedbackId);
    return Response.json(voteDoc);
  };
};

export const GET = async(request) => {
  const url = new URL(request.url);

  if (url.searchParams.get("feedbackIds")) {

    const feedbackIds = url.searchParams.get("feedbackIds").split(",");
    
    const voteDocs = await Vote.find({feedbackId: feedbackIds},null,{sort:{createdAt: 1}});
    // console.log("voteDocs", voteDocs)

    return Response.json(voteDocs);
  };

  return Response.json([]);
};