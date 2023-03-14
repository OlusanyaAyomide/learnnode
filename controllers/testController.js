import { Testpost, Testuser } from "../models/TestModel.js";
import ApiFeatures from "../utills/ApiFeatute.js";
import catchAsync from "../utills/RolesandError.js";

export const PostnewUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await Testuser.create({ name, email });
    res.status(200).json(newUser);
  } catch (err) {
    res.status(404).json({ err: err });
  }
};

export const GetallUser = async (req, res) => {
  const allusers = new ApiFeatures(Testuser.find({}), req.query)
    .filtering()
    .sorting()
    .limiting()
    .paginating();
  const user = await allusers.query.populate("posts");
  res.status(200).json({ data: user });
};

export const PostNewPost = async (req, res) => {
  const { name, body, author } = req.body;
  console.log(req.body);
  try {
    const newpost = await Testpost.create({ name, body, author });
    const postuser = await Testuser.findById(author);
    postuser.posts.push(newpost.id);
    postuser.save();

    res.status(200).json(newpost);
  } catch (err) {
    console.log("heree");
    res.status(404).json({ err });
  }
};

export const GetAllPost = catchAsync(async(req,res,next)=>{
  const post = await Testpost.find({})
  return res.status(200).json({
    status:"success",
    data:{post}
  })
})
