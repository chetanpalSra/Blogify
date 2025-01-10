const {Router} = require('express');

const Blog = require('../models/blog');

const Comment = require('../models/comment');

const multer  = require('multer')

const path = require('path');

const router = Router();

const {handleBlogCreation} = require('../controllers/blog');

//Upload Images -->

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'));
  },
  filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
  }
});

const upload = multer({ storage: storage });


router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user,
        activePage: 'addBlog'
    })
});

router.post('/comment/:blogId',async(req,res)=>{

  console.log(req.body);
  await Comment.create({
          content: req.body.content,
          blogId: req.params.blogId,
          createdBy: req.user._id
  });

  return res.redirect(`/blog/${req.params.blogId}`)

})

router.post('/',upload.single('coverImageUrl'),(req, res, next) => {
  if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
  }
  next();
},handleBlogCreation);

router.get('/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy"); 

  return res.render('blog',{
    user: req.user,
    blog,
    comments,
    activePage: 'home',
  })
})

module.exports = router;