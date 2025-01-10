const Blog = require('../models/blog');

async function handleBlogCreation(req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    });
    // console.log('Uploaded file:', req.file);  // Log the uploaded file

    return res.redirect(`/blog/${blog._id}`);
}

async function handleGetBlog(req,res){
    try{
        const allBlogs = await Blog.find({}).sort({createdAt:-1});
        return res.render("home",{
            user: req.user,
            blogs: allBlogs,
            activePage: 'home',
        })
    }catch(error){
        console.log(`An error occurred:Cannot get Blogs.`);   
    }
    ;//sorting in according to createdAt ,-1 means in descending order.
}

module.exports = {handleBlogCreation,handleGetBlog};