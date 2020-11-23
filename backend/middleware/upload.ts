const multer = require("multer");

// Middleware
const storage = multer.diskStorage({
    destination: "./tmp/",
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now());
    }
});

export const upload_single = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).single("sourceFile");

export const upload_multi = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).array("sourceFiles");
